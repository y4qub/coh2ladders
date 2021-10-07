import React, { useState } from "react";
import { useHistory } from "react-router";
import routes from "../../routes";
import { ConfigProvider, Select, Space } from "antd";
import DatePicker from "../../components/date-picker";
import {
  convertDateToDayTimestamp,
  convertDateToMonthTimestamp,
  convertDateToStartOfMonth,
  getYesterdayDateTimestamp,
  useQuery,
} from "../../utils/helpers";
import { validStatsTypes } from "../../coh/types";
import enGB from "antd/lib/locale/en_GB";

import { isBefore, isAfter } from "date-fns";
import MapStatsGeneralDataProvider from "./map-stats-general-data-provider";
import CustomMapStatsRangeDataProvider from "./map-stats-range-data-provider";
import { DatePickerType } from "../../utils/date-picker-type";
import CustomDatePicker from '../../components/custom-date-picker';

const { RangePicker } = DatePicker;

const MapStats: React.FC = () => {
  const { push } = useHistory();
  const { Option } = Select;

  const query = useQuery();

  const frequency = query.get("range") || "month";
  const timestamp = query.get("timeStamp") || `${convertDateToMonthTimestamp(new Date())}`;
  const type = query.get("type") || "4v4";
  const map = query.get("map") || "8p_redball_express";

  const fromTimeStamp = query.get("fromTimeStamp") || "";
  const toTimeStamp = query.get("toTimeStamp") || "";

  const [datePickerType, setDatePickerType] = useState(frequency as DatePickerType);
  const [dateValue, setDateValue] = useState(
    timestamp
      ? new Date(parseInt(timestamp) * 1000)
      : new Date(getYesterdayDateTimestamp() * 1000),
  );

  const [rangeDate, setRangeDate] = useState(
    fromTimeStamp && toTimeStamp
      ? {
          fromDate: new Date(parseInt(fromTimeStamp) * 1000),
          toDate: new Date(parseInt(toTimeStamp) * 1000),
        }
      : {
          fromDate: new Date(),
          toDate: new Date(),
        },
  );

  const disabledDate = (current: Date) => {
    // we started logging Monday 12.9.2021
    const canBeOld = isBefore(current, new Date(2021, 8, 12));
    const canBeNew = isAfter(current, new Date());

    return canBeOld || canBeNew;
  };

  const onRangePickerChange = (value: any) => {
    const from = (value && value[0]) || new Date();
    const to = (value && value[1]) || new Date();

    const fromDate = new Date(from);
    const toDate = new Date(to);

    setRangeDate({
      fromDate: fromDate,
      toDate: toDate,
    });

    changeStatsRoute({
      datePickerTypeToLoad: datePickerType,
      fromTimeStampToLoad: convertDateToDayTimestamp(fromDate).toString(),
      toTimeStampToLoad: convertDateToDayTimestamp(toDate).toString(),
    });
  };

  const CustomRangePicker = ({ from, to }: { from: Date; to: Date }) => {
    return (
      <ConfigProvider locale={enGB}>
        <RangePicker
          allowClear={false}
          defaultValue={[from, to]}
          disabledDate={disabledDate}
          onChange={onRangePickerChange}
          size={"large"}
        />
      </ConfigProvider>
    );
  };

  const changeStatsRoute = (params: Record<string, any>) => {
    const {
      datePickerTypeToLoad,
      typeToLoad,
      mapToLoad,
      timeStampToLoad,
      fromTimeStampToLoad,
      toTimeStampToLoad,
    } = params;

    let searchValue;

    const typeOfStats = datePickerTypeToLoad || datePickerType;

    if (typeOfStats !== "range") {
      searchValue = `?${new URLSearchParams({
        range: datePickerTypeToLoad || (datePickerType as string),
        type: typeToLoad || type,
        map: mapToLoad || map,
        timeStamp: timeStampToLoad || timestamp,
      })}`;
    } else {
      searchValue = `?${new URLSearchParams({
        range: datePickerTypeToLoad || (datePickerType as string),
        type: typeToLoad || type,
        map: mapToLoad || map,
        fromTimeStamp: fromTimeStampToLoad || fromTimeStamp,
        toTimeStamp: toTimeStampToLoad || toTimeStamp,
      })}`;
    }

    push({
      pathname: routes.mapStats(),
      search: searchValue,
    });
  };

  // I am not really sure about this workflow with useEffect and state for handling this
  // form. I feel like it's not optimal, something is wrong and there is definitely
  // better solution.
  React.useEffect(() => {
    let typeToLoad = "4v4";

    if (validStatsTypes.includes(type)) {
      typeToLoad = type;
    }

    if (datePickerType !== "range") {
      changeStatsRoute({
        datePickerTypeToLoad: datePickerType,
        typeToLoad,
        timeStampToLoad: convertDateToDayTimestamp(dateValue).toString(),
      });
    } else {
      changeStatsRoute({
        datePickerTypeToLoad: datePickerType,
        fromTimeStampToLoad: convertDateToDayTimestamp(rangeDate.fromDate).toString(),
        toTimeStampToLoad: convertDateToDayTimestamp(rangeDate.toDate).toString(),
      });
    }
  }, [datePickerType, dateValue]);

  const onDatePickerTypeSelect = (value: DatePickerType) => {
    if (value === "month") {
      setDateValue(convertDateToStartOfMonth(dateValue));
    }

    setDatePickerType(value);
  };

  const onDateSelect = (value: string) => {
    let actualDate: string | Date = value;

    if (datePickerType === "month") {
      actualDate = convertDateToStartOfMonth(value);
    }

    setDateValue(new Date(actualDate));
  };

  return (
    <div>
      <div>
        <Space
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          wrap
        >
          <Select
            value={datePickerType}
            onChange={onDatePickerTypeSelect}
            style={{ width: 150 }}
            size={"large"}
          >
            <Option value="daily">Daily</Option>
            <Option value="month">Month</Option>
            <Option value="range">Custom Range</Option>
          </Select>
          {datePickerType !== "range" ? (
            <CustomDatePicker
              type={datePickerType}
              onChange={onDateSelect}
              dateValue={dateValue}
              disabledDate={disabledDate}
              showPatches={true}
            />
          ) : (
            <CustomRangePicker from={rangeDate.fromDate} to={rangeDate.toDate} />
          )}
        </Space>
      </div>
      {datePickerType === "range" ? (
        <CustomMapStatsRangeDataProvider urlChanger={changeStatsRoute} />
      ) : (
        <MapStatsGeneralDataProvider urlChanger={changeStatsRoute} />
      )}
    </div>
  );
};

export default MapStats;
