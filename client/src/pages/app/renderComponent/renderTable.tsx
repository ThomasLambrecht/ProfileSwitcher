import ComponentProps from "./ComponentProps";
import DataProps from "./DataProps";

const renderTable = (component: ComponentProps, data: DataProps[]): React.ReactNode => {
  let dataRows = component.props.data;
  if (component.props.dataRef) {
    dataRows = data && data.find((x) => x.name === component.props.dataRef)?.value;
  }

  return (
    <>
      <h3>{component.props.title}</h3>
      <table key={component.id} className="myTable">
        <thead>
          <tr>
            {component.props.headers.map((header: string, index: number) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((dataRow: any, index: number) => (
            <tr key={index}>
              {component.props.dataFields.map((dataFieldSet: string[], index: number) => (
                <td key={index}>
                  {dataFieldSet.map((dataField: string, index: number) => {
                    const value = dataField.split(".").reduce((obj, key) => obj[key], dataRow);
                    if (index === 0) {
                      return <strong>{value}</strong>;
                    }
                    return (
                      <>
                        <br />
                        {value}
                      </>
                    );
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default renderTable;
