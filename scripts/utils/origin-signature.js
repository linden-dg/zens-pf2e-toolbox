

export const getOriginSignature = (token) => token.flags.zen?.originSignature;

export const setOriginSignature = async (token, signature) => token.update({
    flags: {
        zen: {
            originSignature: signature
        }
    }
});



