import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import "./home.css";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useState, Fragment, useEffect } from "react";
import ItemsList from "../Invoice/ItemsList";
import InvoiceList from "../Invoice/InvoiceList";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const addInvoiceStyle = {
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

const addItemStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const defaultInvoice = {
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    items: [],
    note: '',
};

const defaultItem = {
    description: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    total: ''
};

function Home() {
    const [openFormModal, setOpenFormModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState(defaultInvoice);
    const [item, setItem] = useState(defaultItem);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getInvoices();
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const getInvoices = async () => {
        try {
            let res = await (await fetch('http://localhost:9000/api/invoice')).json();
            setInvoices(res);
        } catch (error) {
            console.log(error);
        }
    };

    const getFilteredInvoice = () => {
        return invoices.filter((invoice) => String(invoice.invoiceNumber).includes(searchText.toLowerCase()) || invoice.clientName.toLowerCase().includes(searchText.toLowerCase()));
    };

    const markAsPaid = async (invoice) => {
        try {
            let res = await (await fetch('http://localhost:9000/api/invoice/mark-as-paid/' + invoice._id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })).json();
            if (!res._id) {
                throw Error;
            }
            setTimeout(() => {
                setSuccess("Updated successfully!");
                setOpenSuccess(true);
            }, 1000);
            getInvoices();
        } catch (error) {
            console.log(error);
            setError("Error, Couldn't mark as paid!");
            setOpen(true);
        }
    };

    const sendMail = async (invoice) => {
        try {
            let res = await (await fetch('http://localhost:9000/api/invoice/send-mail/' + invoice._id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })).json();
            if (!res._id) {
                throw Error;
            }
            setTimeout(() => {
                setSuccess("E-mail sent successfully!");
                setOpenSuccess(true);
            }, 1000);
        } catch (error) {
            console.log(error);
            setError("Error, Couldn't send e-mail!");
            setOpen(true);
        }
    };


    const submit = async () => {
        try {
            await (await fetch('http://localhost:9000/api/invoice', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            })).json();
            setOpenFormModal(false);
            setTimeout(() => {
                setSuccess("Invoice added successfully!");
                setOpenSuccess(true);
            }, 1000);
            getInvoices();
        } catch (error) {
            console.log(error);
            setError("Error, Couldn't add invoice!");
            setOpen(true);
        }
    };

    const deleteItem = (itemToDelete) => {
        setInvoiceData({
            ...invoiceData,
            items: invoiceData.items.filter((item) => item !== itemToDelete)
        });
    };

    return (
        <Fragment>

            <div className="main-div">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Item><h2>Invoice management</h2></Item>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <TextField size="small" label="Search" variant="outlined"
                            onChange={(e) => setSearchText(e.target.value)} />
                        <Button onClick={() => { setInvoiceData({ ...defaultInvoice, items: [] }); setOpenFormModal(true); }} variant="contained" style={{ marginLeft: "1em" }}><AddIcon></AddIcon>Add Invoice</Button>
                    </Grid>
                    <Grid item xs={12} className='text-center'>
                        <InvoiceList markAsPaid={markAsPaid} sendMail={sendMail} invoices={getFilteredInvoice() && getFilteredInvoice().length ? getFilteredInvoice() : []}></InvoiceList>
                    </Grid>

                </Grid>
            </div>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                style={{ top: '20px' }}
            >
                <Alert severity="error" onClose={handleClose}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={openSuccess}
                autoHideDuration={4000}
                onClose={handleSuccessClose}
                style={{ top: '20px' }}
            >
                <Alert severity="success" onClose={handleSuccessClose}>
                    {success}
                </Alert>
            </Snackbar>

            <Modal
                open={openFormModal}
                onClose={() => setOpenFormModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addInvoiceStyle}>
                    <div>
                        <CloseIcon className="close-icon" onClick={() => setOpenFormModal(false)}></CloseIcon>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item lg={3}>
                            <TextField size="small" required type="number" fullWidth label="Invoice Number" variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })} />
                        </Grid>
                        <Grid item lg={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Invoice Date" slotProps={{ textField: { size: 'small', required: true } }}
                                    onChange={(date) => setInvoiceData({ ...invoiceData, invoiceDate: date.$d })} />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Due Date" slotProps={{ textField: { size: 'small', required: true } }}
                                    onChange={(date) => setInvoiceData({ ...invoiceData, dueDate: date.$d })} />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={3}>
                            <TextField size="small" required label="Client Name" variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })} />
                        </Grid>
                        <Grid item lg={3}>
                            <TextField size="small" required label="Client Email" fullWidth variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })} />
                        </Grid>
                        <Grid item lg={3}>
                            <TextField size="small" label="Client Phone Number" variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })} />
                        </Grid>
                        <Grid item lg={6}>
                            <TextField size="small" label="Client Address" fullWidth variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })} />
                        </Grid>
                        <Grid item lg={12}>
                            <TextField size="small" fullWidth label="Note" variant="outlined"
                                onChange={(e) => setInvoiceData({ ...invoiceData, note: e.target.value })} />
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <div style={{ fontSize: "1.2em", fontWeight: "500" }}>Items</div>
                            <ItemsList items={invoiceData.items} deleteItem={deleteItem}></ItemsList>
                        </Grid>
                        <Grid item lg={12} xs={12} className="text-center">
                            <Button onClick={() => { setItem(defaultItem); setOpenItemModal(true); }} size="small" variant="outlined"><AddIcon></AddIcon>Add item</Button>
                        </Grid>
                        <Grid item lg={12} xs={12} className="text-center">
                            <Button color="success"
                                disabled={!invoiceData.invoiceNumber || !invoiceData.invoiceDate
                                    || !invoiceData.dueDate || !invoiceData.clientName || !invoiceData.clientEmail}
                                size="large" onClick={submit} variant="contained">
                                Submit</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Modal
                open={openItemModal}
                onClose={() => { setOpenItemModal(false); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={addItemStyle}>
                    <div>
                        <CloseIcon className="close-icon" onClick={() => setOpenItemModal(false)}></CloseIcon>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item lg={6}>
                            <TextField required size="small" fullWidth label="Description" variant="outlined"
                                onChange={(e) => setItem({ ...item, description: e.target.value })} />
                        </Grid>
                        <Grid item lg={2}>
                            <TextField required size="small" fullWidth label="Unit" variant="outlined"
                                onChange={(e) => setItem({ ...item, unit: e.target.value })} />
                        </Grid>
                        <Grid item lg={2}>
                            <TextField required size="small" fullWidth type="number" label="Quantity" variant="outlined"
                                onChange={(e) => setItem({ ...item, quantity: e.target.value })} />
                        </Grid>
                        <Grid item lg={2}>
                            <TextField required size="small" fullWidth type="number" label="Unit Price (₹)" variant="outlined"
                                onChange={(e) => setItem({ ...item, unitPrice: e.target.value })} />
                        </Grid>
                        <Grid item lg={12} xs={12} className="text-center">
                            <Button
                                disabled={!item.description || !item.unit || !item.quantity || !item.unitPrice}
                                onClick={() => { item.total = item.quantity * item.unitPrice; invoiceData.items.push(item); setOpenItemModal(false); }}
                                color="success" size="small" variant="contained">Add</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default Home;