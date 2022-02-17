# Using Vite and Django in Different Folder

前后端文件夹分离样例

## Step by step:

### Development Mode

1. ライブラリをインストール

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

2. 改造版[django-vite](https://github.com/MrBin99/django-vite)をインストール

```
cd django-vite-package
python setup.py develop
```

3. バックエンド django を起動

```
cd ..\backend\
python manager.py runserver
```

4. フロントエンド vite を起動

```
cd ..\frontend\
yarn add
yarn dev
```

### Production Mode

Build static files by vite

```
cd ..\frontend\
yarn build
```

Collect static files for Django

```
cd ..\backend\
python manager.py collectstatic
```

## Settings

Modified `django-vite`. Cause it'll make assets url like: `localhost:3000/static/src/main.ts`. The `static` comes with `STATIC_URL` in django's `settings.py`.

```python
# django-vite/templatetags/django_pyte.py
@staticmethod
def _generate_vite_server_url(path: Optional[str] = None) -> str:
    return urljoin(
        f"{DJANGO_VITE_DEV_SERVER_PROTOCOL}://"
        f"{DJANGO_VITE_DEV_SERVER_HOST}:{DJANGO_VITE_DEV_SERVER_PORT}",
        # urljoin(DJANGO_VITE_STATIC_URL, path if path is not None else ""),
        path if path is not None else "",
    )
```

frontend: `vite.config.ts`
```ts
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  ...
  build:{
    manifest: true,
    rollupOptions:{
      input:{
        main: './src/main.ts'
      },
      output:{
        chunkFileNames: undefined,
      }
    }
  },
  ...
})
```

backend: `settings.py`
```py
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BASE_DIR.parent
# ...
INSTALLED_APPS = [
    # ...
    'django_vite',
    # ...
]
# ...
DJANGO_VITE_ASSETS_PATH = PROJECT_DIR / 'frontend' / 'dist'
DJANGO_VITE_DEV_MODE = DEBUG
DJANGO_VITE_MANIFEST_PATH = PROJECT_DIR / 'frontend' / 'dist' / 'manifest.json'

STATICFILES_DIRS = [
    DJANGO_VITE_ASSETS_PATH,
]
# static files settings 
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'static'
```


