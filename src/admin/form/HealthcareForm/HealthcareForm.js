import BootstrapButton from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './HealthcareForm.scss';
import _ from 'lodash';
import { validateEmpty } from '../../../util/validate';
import { createHealthcarePackage, updateHealthcarePackage } from '../../../service/healthcareService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import React from 'react';
// import { v4 as uuidv4 } from 'uuid';

const HealthcareForm = (props) => {

    var tempSelectedPackage = props.selectedPackage
    const [dataService, setDataService] = useState([]);

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            const id = Date.now(); //
            setRows((oldRows) => [...oldRows, { id, Name: '', Price: '', IsRequired: true, isNew: true }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
            setDataService([...dataService, { id, Name: '', Price: '', IsRequired: true, isNew: true, status: 'create' }]);
        };

        return (
            <GridToolbarContainer>
                <div className='d-flex justify-content-between align-items-center px-2' style={{ width: '100%' }}>
                    <div>
                        Service List
                    </div>
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} disabled={!editMode && !_.isEmpty(tempSelectedPackage)}>
                        Add record
                    </Button>
                </div>
            </GridToolbarContainer>
        );
    }

    const [editMode, setEditMode] = useState(false);
    const [healthcare, setHealthcare] = useState({

    });

    const basePrice = (arr) => {
        if (_.isEmpty(arr)) return 0
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            if ((arr[i].IsRequired === 1 || arr[i].IsRequired === true) && arr[i].Price !== null && arr[i].Price !== "" && arr[i].status !== 'delete') {
                sum += arr[i].Price
            }
        }
        return sum
    }

    const maxPrice = (arr) => {
        if (_.isEmpty(arr)) return 0
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].Price !== null && arr[i].Price !== "" && arr[i].status !== 'delete') {
                sum += arr[i].Price
            }
        }
        return sum
    }

    const validateService = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (_.isEmpty(arr[i].Name) || arr[i].Price === "" || arr[i].Price === null) {
                return false
            }
        }
        return true
    }

    const handleCreate = () => {
        if (validateEmpty(healthcare, ["Name", "Description"]) && dataService.length > 0 && validateService(dataService)) {
            healthcare.Price = basePrice(dataService)
            healthcare.MaxPrice = maxPrice(dataService)
            healthcare.dataService = dataService
            healthcare.IsDeleted = false
            createHealthcarePackage(healthcare).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
                closeForm();
            })
        } else {
            toast.error("Please fill required fields")
        }
    }

    const handleUpdate = () => {
        if (validateEmpty(healthcare, ["Name", "Description"]) && dataService.length > 0 && validateService(dataService)) {
            healthcare.Price = basePrice(dataService)
            healthcare.MaxPrice = maxPrice(dataService)
            healthcare.dataService = dataService
            healthcare.IsDeleted = false
            updateHealthcarePackage(healthcare).then((e) => {
                if (e.data.code === 0) {
                    toast.success(e.data.message);
                } else {
                    toast.error(e.data.message);
                }
                props.fetchData()
                closeForm();
            })
        } else {
            toast.error("Please fill required fields")
        }
    }

    const closeForm = () => {
        props.setShow(false);
        props.setSelectedPackage(null)
        setEditMode(false)
        setHealthcare({})
        setRowModesModel({})
        setRows([])
        setDataService([])
    }

    // input change
    const onInputChange = e => {
        const { name, value } = e.target;
        setHealthcare(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        if (!_.isEmpty(props.selectedPackage)) {
            setHealthcare({ ...props.selectedPackage })
            let temp = props.selectedPackage.healthcare_services
            for (let i = 0; i < temp.length; i++) {
                temp[i].id = temp[i].ID
                temp[i].status = ''
            }
            temp.sort(function (a, b) {
                return b.IsRequired - a.IsRequired;
            });
            setRows([...temp])
            setDataService([...temp])
        } else {
            setHealthcare({
                ID_clinic: props?.clinic[0]?.ID,
                ID_healthcare_type: props?.healthcareType[0]?.ID
            })
        }

    }, [props.selectedPackage, props.show])

    const [rows, setRows] = React.useState(
        // initialRows
        []
    );
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));

        let temp = dataService.find((item) => item.id === id);
        if (temp.status === 'create') {
            setDataService(dataService.filter((item) => item.id !== id));
        } else {
            temp.status = 'delete';
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)).sort(function (a, b) {
            return b.IsRequired - a.IsRequired;
        }));

        let temp = dataService.find((item) => item.id === newRow.id);
        let tempRow = { ...newRow, isNew: false };

        if (temp?.status !== 'create') {
            tempRow.status = 'update';
        } else {
            tempRow.status = 'create';
        }

        let tempDataService = dataService.map((item) => (item.id === newRow.id ? tempRow : item));
        tempDataService.sort(function (a, b) {
            return b.IsRequired - a.IsRequired;
        });

        setDataService(tempDataService);

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'Name',
            headerName: 'Name',
            width: 280,
            align: 'center',
            headerAlign: 'center',
            type: 'string',
            editable: true
        },
        {
            field: 'Price',
            headerName: 'Price',
            width: 230,
            align: 'center',
            headerAlign: 'center',
            type: 'number',
            editable: true
        },
        {
            field: 'IsRequired',
            headerName: 'IsRequired',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            type: 'boolean',
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                        disabled={!editMode && !_.isEmpty(props.selectedPackage)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                        disabled={!editMode && !_.isEmpty(props.selectedPackage)}
                    />,
                ];
            },
        },
    ];


    return (
        <>
            <Modal show={props.show} onHide={() => closeForm()} size="lg" centered id="healthcare-form">
                <Modal.Header closeButton>
                    <Modal.Title>Heatlhcare Package Infomation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row">

                        <div className='col-6'>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>ID</Form.Label>
                                <Form.Control disabled value={healthcare?.ID} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Clinic</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.selectedPackage)} name='ID_clinic' value={healthcare?.ID_clinic} onChange={onInputChange} >
                                    <option value="" disabled>Please select...</option>
                                    {props?.clinic?.map((item) => {
                                        return <option key={item.ID} value={item.ID}>{item.Name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className='col-6'>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control disabled={!editMode && !_.isEmpty(props.selectedPackage)} name='Name' type="text" value={healthcare?.Name} onChange={onInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Type</Form.Label>
                                <Form.Select disabled={!editMode && !_.isEmpty(props.selectedPackage)} name='ID_healthcare_type' value={healthcare?.ID_healthcare_type} onChange={onInputChange} >
                                    <option value="" disabled>Please select...</option>
                                    {props?.healthcareType?.map((item) => {
                                        return <option key={item.ID} value={item.ID}>{item.Name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3 col-12" controlId="formBasicEmail">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} disabled={!editMode && !_.isEmpty(props.selectedPackage)} name='Description' type="text" value={healthcare?.Description} onChange={onInputChange} />
                        </Form.Group>

                        <Box
                            sx={{
                                height: 300,
                                width: '100%',
                                '& .actions': {
                                    color: 'text.secondary',
                                },
                                '& .textPrimary': {
                                    color: 'text.primary',
                                },
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                editMode="none"
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={handleRowModesModelChange}
                                onRowEditStop={handleRowEditStop}
                                processRowUpdate={processRowUpdate}
                                slots={{
                                    toolbar: EditToolbar,
                                }}
                                slotProps={{
                                    toolbar: { setRows, setRowModesModel },
                                }}
                            />
                        </Box>

                        <div className="d-flex justify-content-between align-items-center mt-3">

                            <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                                <span>Price: </span>
                                {
                                    basePrice(dataService) === maxPrice(dataService)
                                        ? basePrice(dataService)
                                        : basePrice(dataService) + " - " + maxPrice(dataService)
                                }
                                <span> VND</span>
                            </div>
                            <div className='d-flex gap-3'>
                                {
                                    <>
                                        <BootstrapButton variant="primary" type="button" className='btn-cancel' onClick={() => closeForm()} >
                                            Cancel
                                        </BootstrapButton>
                                        {
                                            _.isEmpty(props.selectedPackage) ? (
                                                <BootstrapButton variant="primary" type="button" className='btn-create' onClick={() => handleCreate()}>
                                                    Create
                                                </BootstrapButton>
                                            ) : (
                                                <>
                                                    {
                                                        props.selectedPackage.IsDeleted ? (
                                                            <>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {!editMode ? (
                                                                    <BootstrapButton variant="primary" type="button" className='btn-edit' onClick={() => setEditMode(true)}>
                                                                        Edit
                                                                    </BootstrapButton>
                                                                )
                                                                    : (
                                                                        <BootstrapButton variant="primary" type="button" className='btn-create' onClick={() => handleUpdate()}>
                                                                            Save
                                                                        </BootstrapButton>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default HealthcareForm