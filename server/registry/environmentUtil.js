const EnvironmentUtil = {
    getPort() {
        return process.env.PORT || 3000;
    },

    getPublicServerAddress() {
        return process.env.PUBLIC_SERVER_ADDRESS || 'ws://localhost:3000';
    },

    getRegistryAddress() {
        return process.env.REGISTRY_URL || 'http://localhost:3001/api';
    }
};


export default EnvironmentUtil;