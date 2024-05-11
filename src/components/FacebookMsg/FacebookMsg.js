import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMsg = () => {

    return (
        <FacebookProvider appId="1002577934754132" chatSupport>
            <CustomChat pageId="314203795110867" minimized={"true"} />
        </FacebookProvider>
    )
}

export default FacebookMsg