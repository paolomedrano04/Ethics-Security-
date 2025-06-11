import os
import gzip
import shutil
from glob import glob

BACKUP_DIR = 'backups'
TARGET_FILE = 'seguridad.csv'

def latest_backup():
    files = sorted(glob(os.path.join(BACKUP_DIR, 'seguridad_*.csv.gz')))
    return files[-1] if files else None

def restore():
    latest = latest_backup()
    if not latest:
        print('No hay backups disponibles.')
        return
    with gzip.open(latest, 'rb') as src, open(TARGET_FILE, 'wb') as dst:
        shutil.copyfileobj(src, dst)
    print(f'Restore completado desde: {latest}')

if __name__ == '__main__':
    restore()
