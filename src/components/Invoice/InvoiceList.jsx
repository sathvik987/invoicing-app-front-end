import { useState, Fragment } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import ItemsList from "./ItemsList";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '90vh',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function InvoiceList(props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [itemsToView, setItemsToView] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Fragment>
            {props.invoices && props.invoices.length ? <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ height: "66vh" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Invoice Number
                                </TableCell>

                                <TableCell>
                                    Invoice Date
                                </TableCell>

                                <TableCell>
                                    Due Date
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Client Name
                                </TableCell>

                                <TableCell>
                                    Client Email
                                </TableCell>


                                <TableCell>
                                    Client Phone
                                </TableCell>

                                <TableCell>
                                    Client Address
                                </TableCell>

                                <TableCell>
                                    Items
                                </TableCell>

                                <TableCell>
                                    Note
                                </TableCell>

                                <TableCell>

                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.invoices
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((invoice) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={invoice._id}>
                                            <TableCell>
                                                {invoice.invoiceNumber}
                                            </TableCell>

                                            <TableCell>
                                                {new Date(invoice.invoiceDate).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                {new Date(invoice.dueDate).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                {invoice.paid
                                                    ? <Chip label="Paid" size="small" color="success" />
                                                    : new Date(invoice.dueDate).getTime() <= new Date().getTime() ? <Chip label="Late" style={{ backgroundColor: 'red', color: 'white' }} size="small" /> :
                                                        <Chip label="Outstanding" color="primary" size="small" />}
                                            </TableCell>

                                            <TableCell>
                                                {invoice.clientName}
                                            </TableCell>

                                            <TableCell>
                                                {invoice.clientEmail}
                                            </TableCell>

                                            <TableCell>
                                                {invoice.clientPhone}
                                            </TableCell>

                                            <TableCell>
                                                {invoice.clientAddress}
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    invoice.items && invoice.items.length ?
                                                        <div onClick={() => { setItemsToView(invoice.items); setOpenItemModal(true); }} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>View</div> : ''
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {invoice.note}
                                            </TableCell>

                                            <TableCell>
                                                {!invoice.paid ? <Button size="small" variant="outlined" onClick={() => { props.markAsPaid(invoice); }}>Mark as paid</Button> : ''}
                                                <Button onClick={() => { props.sendMail(invoice); }} style={{ marginLeft: '0.5em' }} size="small" variant="outlined">Send Mail</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.invoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper> : "No data found."}

            <Modal
                open={openItemModal}
                onClose={() => setOpenItemModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <CloseIcon className="close-icon" onClick={() => setOpenItemModal(false)}></CloseIcon>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item lg={12} xs={12}>
                            <ItemsList items={itemsToView}></ItemsList>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Fragment>
    );
}


export default InvoiceList;