import { ConfigProvider } from "antd";
import DatePicker from "../components/date-picker";
import enGB from "antd/lib/locale/en_GB";
import { DatePickerType } from "../utils/date-picker-type";

const PickerWithType = ({
  dateValue,
  disabledDate,
  type,
  onChange,
}: {
  dateValue: Date;
  disabledDate: (current: Date) => boolean;
  type?: DatePickerType;
  onChange: any;
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
      />
    </ConfigProvider>
  );
};

export default PickerWithType;
