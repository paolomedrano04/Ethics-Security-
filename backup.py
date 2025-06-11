import os
import gzip
import shutil
import hashlib
from datetime import datetime

SOURCE_FILE = 'seguridad.csv'
BACKUP_DIR  = 'backups'
LOG_FILE    = os.path.join(BACKUP_DIR, 'checksums.log')

def ensure_backup_dir():
    os.makedirs(BACKUP_DIR, exist_ok=True)

def timestamped_name():
    ts = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    return f'seguridad_{ts}.csv.gz'

def compute_md5(path, block_size=65536):
    md5 = hashlib.md5()
    with gzip.open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size), b''):
            md5.update(chunk)
    return md5.hexdigest()

def write_log(filename, checksum):
    with open(LOG_FILE, 'a') as log:
        log.write(f'{datetime.now().isoformat()}  {filename}  {checksum}\n')

def create_backup():
    ensure_backup_dir()
    name = timestamped_name()
    dest = os.path.join(BACKUP_DIR, name)
    with open(SOURCE_FILE, 'rb') as src, gzip.open(dest, 'wb') as dst:
        shutil.copyfileobj(src, dst)
    chk = compute_md5(dest)
    write_log(name, chk)
    print(f'Backup creado: {dest}')
    print(f'Checksum MD5: {chk}')

if __name__ == '__main__':
    create_backup()
