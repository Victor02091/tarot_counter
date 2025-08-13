import importlib
import pkgutil
import pathlib

# dynamically import all submodules in the models package for alembic to detect
package_dir = pathlib.Path(__file__).parent
for (_, module_name, _) in pkgutil.iter_modules([str(package_dir)]):
    importlib.import_module(f"{__name__}.{module_name}")
