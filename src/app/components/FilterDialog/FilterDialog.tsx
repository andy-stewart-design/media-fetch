import { useContext } from "react";
import Dialog from "@components/Dialog";
import FilterHeader from "./FilterHeader";
import QualityFilter from "./QualityFilter";
import SizeFilter from "./SizeFilter";
import OrientationFilter from "./OrientationFilter/";
import ColorFilter from "./ColorFilter";
import FilterFooter from "./FilterFooter/";
import { FilterDialogDisplayContext } from "@components/Providers/FilterDialogDisplayProvider";
import { SearchFilterContext } from "@components/Providers/SearchFilterProvider";
import { ExportSettingsContext } from "@components/Providers/ExportSettingsProvider";
import { useNumberInput, useRadio } from "@hooks/use-input";
import { COLOR_OPTIONS, ORIENTATION_OPTIONS } from "@src/app/constants/filters";
import classes from "./component.module.css";

export default function FilterDialog() {
  // GLOBAL STATE
  const { showDialog, setShowDialog } = useContext(FilterDialogDisplayContext);
  const { searchFilters, setSearchFilters } = useContext(SearchFilterContext);
  const { exportSettings, setExportSettings } = useContext(
    ExportSettingsContext
  );

  // LOCAL STATE
  const [orientation, setOrientation] = useRadio("all");
  const [primaryColor, setPrimaryColor] = useRadio("any");
  const [exportQuality, setExportQuality, restExportQualityProps] =
    useNumberInput(60, 1, 100, 1);
  const [exportSize, setExportSize, restExportSizeProps] = useNumberInput(
    2400,
    1200,
    3200,
    100
  );

  const disableApplyFilters =
    orientation === searchFilters.orientation &&
    primaryColor === searchFilters.primaryColor &&
    exportQuality === exportSettings.quality &&
    exportSize === exportSettings.size;

  function applyFilters() {
    if (
      orientation !== searchFilters.orientation ||
      primaryColor !== searchFilters.primaryColor
    ) {
      setSearchFilters({ orientation, primaryColor });
    }

    if (
      exportQuality !== exportSettings.quality ||
      exportSize !== exportSettings.size
    ) {
      setExportSettings({ quality: exportQuality, size: exportSize });
    }

    setShowDialog();
  }

  function handleCancel() {
    setOrientation(searchFilters.orientation);
    setPrimaryColor(searchFilters.primaryColor);

    setShowDialog();
  }

  return (
    <Dialog
      className={classes["dialog"]}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
    >
      <section>
        <FilterHeader setShowDialog={handleCancel} />
      </section>
      <section>
        <OrientationFilter
          label="Orientation"
          value={orientation}
          onChange={setOrientation}
          options={ORIENTATION_OPTIONS}
        />
      </section>
      <section>
        <ColorFilter
          label="Primary Color"
          value={primaryColor}
          onChange={setPrimaryColor}
          options={COLOR_OPTIONS}
        />
      </section>
      <section className="flex gap-xs">
        <QualityFilter
          value={exportQuality}
          onChange={setExportQuality}
          {...restExportQualityProps}
        />
        <SizeFilter
          value={exportSize}
          onChange={setExportSize}
          {...restExportSizeProps}
        />
      </section>
      <section>
        <FilterFooter
          handleCancel={handleCancel}
          applyFilters={applyFilters}
          disableApplyFilters={disableApplyFilters}
        />
      </section>
    </Dialog>
  );
}
