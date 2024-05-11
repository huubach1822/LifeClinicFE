import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMsg = () => {

    return (
        <FacebookProvider appId="3741911936085473" chatSupport>
            <CustomChat pageId="314203795110867" minimized={"true"} />
        </FacebookProvider>
    )
}

export default FacebookMsg