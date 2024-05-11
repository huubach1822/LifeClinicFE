import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMsg = () => {

    return (
        <FacebookProvider appId="437122122597490" chatSupport>
            <CustomChat pageId="291497167386598" minimized={"true"} />
        </FacebookProvider>
    )
}

export default FacebookMsg