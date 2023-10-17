import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment } from "react";
import Grid from '@mui/material/Grid';

function ItemsList(props) {
    let total = props.items.reduce((acc, item) => item.total + acc, 0);
    return (
        <div className="items-list" style={{ textAlign: 'center' }}>{
            props && props.items && props.items.length ?
                (
                    <Fragment>
                        <TableContainer sx={{ maxHeight: "27vh" }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Description
                                        </TableCell>
                                        <TableCell>
                                            Unit
                                        </TableCell>
                                        <TableCell>
                                            Quantity
                                        </TableCell>
                                        <TableCell>
                                            Unit Price (₹)
                                        </TableCell>
                                        <TableCell>
                                            Total Price (₹)
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.items.map((item, index) => {
                                            return <TableRow key={index} hover role="checkbox" tabIndex={-1} >
                                                <TableCell>
                                                    {item.description}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unit}
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unitPrice}
                                                </TableCell>
                                                <TableCell>
                                                    {item.total}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        props.deleteItem ? <DeleteIcon onClick={() => props.deleteItem(item)} style={{ color: 'red', cursor: 'pointer' }} ></DeleteIcon> : ''
                                                    }
                                                </TableCell>
                                            </TableRow>;
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid item lg={12} xs={12} style={{ marginTop: '1em' }}>
                            <span>Total (₹) - {total} </span>
                        </Grid>
                    </Fragment>
                ) : <span>No items added yet.</span>}
        </div>
    );
}

export default ItemsList;