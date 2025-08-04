import tls from 'tls';

export async function getSSLCertificateInfo(
  host: string,
  port = 443
): Promise<{
  validFrom: string;
  validTo: string;
  issuer: string;
}> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { servername: host }, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
        return;
      }

      resolve({
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        issuer: cert.issuer?.O || JSON.stringify(cert.issuer),
      });

      socket.end();
    });

    socket.on('error', (err) => {
      reject(err instanceof Error ? err : new Error(String(err)));
    });
  });
}
