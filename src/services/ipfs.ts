import * as IPFS from 'ipfs-core'

var ipfs;

export async function init(): Promise<IPFS.IPFS> {
    ipfs = await IPFS.create();
    return ipfs;
}

export async function publish(data: Uint8Array): Promise<string> {
    if (!ipfs) throw 'Error trying to call IPFS.publish(). The IPFS.init() function needs to be called first.';
    const result = await ipfs.add(data);
    const url = 'https://ipfs.io/ipfs/' + result.cid.toString();
    return url;
}