import { ConfigProvider } from "antd";
import DatePicker from "./date-picker";
import enGB from "antd/lib/locale/en_GB";
import { DatePickerType } from "../utils/date-picker-type";
import moment from "moment";
import { isPatchDate } from "../coh/patches";

const CustomDatePicker = ({
  dateValue,
  disabledDate,
  type,
  onChange,
  showPatches,
}: {
  dateValue: Date;
  disabledDate: (current: Date) => boolean;
  type?: DatePickerType;
  onChange: any;
  showPatches?: boolean;
}) => {
  // @ts-ignore
  let pickerType = type === "daily" ? "date" : type;

  if (pickerType === "range") {
    return <>ERROR</>;
  }

  const renderPatches = (current: any) => {
    const style = { border: "1px solid #1890ff", borderRadius: "50%" };
    const momentDate = moment(current);

    return (
      <div className="ant-picker-cell-inner" style={isPatchDate(momentDate.unix()) ? style : {}}>
        {momentDate.date()}
      </div>
    );
  };

  return (
    // locale enGB for Monday as start of the week
    <ConfigProvider locale={enGB}>
      <DatePicker
        picker={pickerType}
        onChange={onChange}
        allowClear={false}
        defaultValue={dateValue}
        disabledDate={disabledDate}
        size={"large"}
        dateRender={showPatches ? renderPatches : undefined}
      />
    </ConfigProvider>
  );
};

export default CustomDatePicker;
