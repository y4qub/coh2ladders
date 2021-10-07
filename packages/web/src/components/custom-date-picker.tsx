import { ConfigProvider } from "antd";
import DatePicker from "./date-picker";
import enGB from "antd/lib/locale/en_GB";
import { DatePickerType } from "../utils/date-picker-type";

const CustomDatePicker = ({
  dateValue,
  disabledDate,
  type,
  onChange,
  dateRender,
}: {
  dateValue: Date;
  disabledDate: (current: Date) => boolean;
  type?: DatePickerType;
  onChange: any;
  dateRender?: (current: Date) => JSX.Element;
}) => {
  // @ts-ignore
  let pickerType = type === "daily" ? "date" : type;

  if (pickerType === "range") {
    return <>ERROR</>;
  }

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
        dateRender={dateRender}
      />
    </ConfigProvider>
  );
};

export default CustomDatePicker;
