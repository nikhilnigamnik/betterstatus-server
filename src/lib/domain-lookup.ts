import { whois } from '@cleandns/whois-rdap';
import { format } from 'date-fns';

export async function lookupDomain(domain: string) {
  const response = await whois(domain);

  return {
    registrar: response.registrar?.name || 'Unknown',
    createdAt: format(new Date(response.ts?.created || Date.now()), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(new Date(response.ts?.updated || Date.now()), 'yyyy-MM-dd HH:mm:ss'),
    expires: format(new Date(response.ts?.expires || Date.now()), 'yyyy-MM-dd HH:mm:ss'),
  };
}
