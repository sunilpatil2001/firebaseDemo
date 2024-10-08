import './App.css'
import prescriptionOptions from './options/prescription';

function TableRows({ rowsData, on, deleteTableRows, handleText }) {
    return (
        rowsData.map((data, index) => {
            return (
                <tr key={index} className="clearfix">
                    <th>{index + 1}</th>
                    <td>
                        <td className='col-md-1'>
                            <input type="text" onChange={(evnt) => (handleText(index, evnt))} name="name" className="form-control text-center" />
                        </td>
                    </td>
                    <td className='col-md-1'>
                        <input type="text" onChange={(evnt) => (handleText(index, evnt))} name="morning" className="form-control text-center" />
                    </td>
                    <td className='col-md-1'>
                        <input type="text" onChange={(evnt) => (handleText(index, evnt))} name="afternoon" className="form-control text-center" />
                    </td>
                    <td className='col-md-1'>
                        <input type="text" onChange={(evnt) => (handleText(index, evnt))} name="night" className="form-control text-center" />
                    </td>
                    <td className='col-md-1'>
                        <input type="text" onChange={(evnt) => (handleText(index, evnt))} name="days" className="form-control text-center" />
                    </td>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                    </td>
                </tr>
            )
        })
    )
}

export default TableRows;