import { IpInfo } from '../types';

export const getIpInfo = async (): Promise<IpInfo> => {
  const response = await fetch(`https://ipinfo.betterstatus.co`);
  return response.json() as Promise<IpInfo>;
};
