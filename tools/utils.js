function getUnixTimestamp() {
    var unixTimestamp = Math.floor(new Date().getTime()/1000);

    return unixTimestamp;
}

function getLocalTimestringFromUnixTimestamp(ts) {
    return new Date(ts * 1000).toLocaleString();
}

export const getUnixTimestamp = getUnixTimestamp;
export const getTimestringFromUnixTimestamp = getTimestringFromUnixTimestamp;
