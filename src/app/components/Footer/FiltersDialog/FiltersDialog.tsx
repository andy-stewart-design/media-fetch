import { useContext } from 'react';
import { Root, Portal, Overlay, Content, Trigger } from '@radix-ui/react-dialog';
import FiltersHeader from './FilterHeader/FiltersHeader';
import OrientationFilter from './OrientationFilter';
import ColorFilter from './ColorFilter';
import QualityFilter from './QualityFilter';
import SizeFilter from './SizeFilter';
import FilterFooter from './FilterFooter';
import { Filter } from '@components/icons/16';
import { SearchFilterContext } from '@components/Providers/SearchFilterProvider';
import { ExportSettingsContext } from '@components/Providers/ExportSettingsProvider';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { ToggleAction, useNumberInput, useRadio } from '@src/hooks/use-input';
import { ORIENTATION_OPTIONS, COLOR_OPTIONS } from '@src/app/constants/filters';
import classes from './component.module.css';

interface PropTypes {
  setShowDialog: ToggleAction;
}

export function FiltersDialogContent({ setShowDialog }: PropTypes) {
  // GLOBAL STATE
  const { setSearchQuery } = useContext(SearchQueryContext);
  const { searchFilters, setSearchFilters } = useContext(SearchFilterContext);
  const { exportSettings, setExportSettings } = useContext(ExportSettingsContext);

  // LOCAL STATE
  const [orientation, setOrientation] = useRadio('all');
  const [primaryColor, setPrimaryColor] = useRadio('any');
  const [exportQuality, setExportQuality, restExportQualityProps] = useNumberInput(50, 1, 100, 1);
  const [exportSize, setExportSize, restExportSizeProps] = useNumberInput(1600, 1200, 3200, 100);

  const disableApplyFilters =
    orientation === searchFilters.orientation &&
    primaryColor === searchFilters.primaryColor &&
    exportQuality === exportSettings.quality &&
    exportSize === exportSettings.size;

  function applyFilters() {
    if (orientation !== searchFilters.orientation || primaryColor !== searchFilters.primaryColor) {
      setSearchQuery((current) => ({ ...current, page: 1 }));
      setSearchFilters({ orientation, primaryColor });
    }

    if (exportQuality !== exportSettings.quality || exportSize !== exportSettings.size) {
      setExportSettings({ quality: exportQuality, size: exportSize });
    }

    setShowDialog(false);
  }

  function handleCancel() {
    setOrientation(searchFilters.orientation);
    setPrimaryColor(searchFilters.primaryColor);

    setShowDialog(false);
  }

  return (
    <Portal>
      <Overlay className={classes.overlay} />
      <Content className={classes.dialog}>
        <section>
          <FiltersHeader />
        </section>
        <section>
          <OrientationFilter
            label="Orientation"
            value={orientation}
            onChange={setOrientation}
            options={ORIENTATION_OPTIONS}
          />
          <ColorFilter
            label="Primary Color"
            value={primaryColor}
            onChange={setPrimaryColor}
            options={COLOR_OPTIONS}
          />
          <div className="flex gap-xs">
            <QualityFilter
              value={exportQuality}
              onChange={setExportQuality}
              {...restExportQualityProps}
            />
            <SizeFilter value={exportSize} onChange={setExportSize} {...restExportSizeProps} />
          </div>
        </section>
        <section>
          <FilterFooter
            handleCancel={handleCancel}
            applyFilters={applyFilters}
            disableApplyFilters={disableApplyFilters}
          />
        </section>
      </Content>
    </Portal>
  );
}

export const FiltersDialog = Root;

export function FiltersDialogTrigger() {
  return (
    <Trigger className={classes.trigger}>
      <Filter /> Filters
    </Trigger>
  );
}
