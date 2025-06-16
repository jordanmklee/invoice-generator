import { useState, useEffect } from "react";

import { Button, Stack, Divider, TableHead, TableFooter } from '@mui/material';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';

import StyledPaper from './StyledPaper';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';
import { Edit as EditIcon } from '@mui/icons-material';

import dayjs from "dayjs";

import generatePDF from '../PDFGenerator';

export default function Form(props){
	// TODO the fields should use the default value too
	const [company, setCompany] = useState({
		name: localStorage.getItem("company.name"),
		phone: localStorage.getItem("company.phone"),
		email: localStorage.getItem("company.email"),
		businessNumber: localStorage.getItem("company.businessNumber"),
	})

	const [invoice, setInvoice] = useState({
		date: dayjs(new Date()),
		number: "",
		customer: "",
		address: {
			address1: "",
			city: "",
			province: "",
			postalCode: "",
		},
		items: {
			list: [{
				description: "",
				qty: 1,
				rate: 0.00,
				amount: 0.00,
			}],
			summary: {
				subtotal: 0.00,
				tax: 0.00,
				total: 0.00,
			}
		},
		notes: "",
	})

	function updateCompany(updates) {
		setCompany(prev => {
			const newCompany = { ...prev, ...updates };

			for (const key in updates) {
				if (updates.hasOwnProperty(key)) {
					localStorage.setItem(`company.${key}`, updates[key]);
				}
			}

			return newCompany;
		});
	}


	function updateInvoice(updates){
		setInvoice(prev => ({
			...prev,
			...updates,
		}))
	}

	// Update the summary calculation on item change
	useEffect(() => {
		const subtotal = invoice.items.list.reduce((sum, item) => sum + item.amount, 0);
		const tax = subtotal * 0.05;
		const total = subtotal + tax;

		setInvoice(prev => ({
			...prev,
			items: {
				...prev.items,
				summary: {
					subtotal,
					tax,
					total
				}
			}
		}));
	}, [invoice.items.list]);

	// TODO make a helper function to parse dollar amounts (and handle NaN errors when generating)
	
	function addNewItem(){
		setInvoice(prev => ({
			...prev,
			items: {
				...prev.items,
				list: [...prev.items.list, { description: "", qty: 1, rate: 0.00, amount: 0.00, }]
			}
		}));
	}

	function deleteItem(index) {
		setInvoice(prev => ({
			...prev,
			items: {
				...prev.items,
				list: prev.items.list.filter((item, i) => i !== index)
			}
		}));
	}


	function setItemProperty(property, value, index) {
		setInvoice(prev => {
			const updatedList = [...prev.items.list];
			updatedList[index] = {
				...updatedList[index],
				[property]: value
			};

			return {
				...prev,
				items: {
					...prev.items,
					list: updatedList
				}
			};
		});
	}

	return(
		<Stack gap="16px" paddingTop="32px" sx={{ ...props.sx, overflowY: "auto" }}>
			<Stack gap="16px" direction="row" justifyContent="space-between">
				<Typography variant="h1">
					Create invoice
				</Typography>
				<Button
					variant="contained"
					onClick={() => generatePDF(company, invoice)}>Generate PDF</Button>
			</Stack>

			<Stack gap="16px" direction="row">
				<Stack gap="16px" flex={2}>
					<CompanyForm
						company={company}
						updateCompany={updateCompany}/>
					
					<StyledPaper>
						<Typography variant="h2">Invoice</Typography>
						<Stack direction="row" gap="16px">
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									format="LL"
									label="Date"
									value={invoice.date}
									onChange={e => updateInvoice({ date: e.target.value })}/>
							</LocalizationProvider>

							<TextField
								label="Invoice Number"
								value={props.invoiceNumber}
								onChange={e => updateInvoice({ number: e.target.value })}/>
						</Stack>

						{/* Items Form */}
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ width: "50%" }}>Item</TableCell>
									<TableCell sx={{ width: "15%" }}>Quantity</TableCell>
									<TableCell>Rate</TableCell>
									<TableCell/>
								</TableRow>
							</TableHead>
							

							<TableBody>
								{
									invoice.items.list.map((item, index) => (
										<InvoiceItem
											key={index}
											id={index}
											data={item}
											setItemProperty={(property, value) => setItemProperty(property, value, index)}
											handleDelete={deleteItem}
											// Autofocus newly added items
											autoFocus={ (index === invoice.items.list.length - 1) && index !== 0 }
											addNewItem={addNewItem}/>
									))
								}
							</TableBody>

							<TableFooter>
								<TableRow>
									<TableCell sx={{ borderBottom: 'none' }}>
										<Button
											variant="text"
											size="small"
											startIcon={<AddIcon />}
											onClick={addNewItem}>New Item</Button>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>

						<TextField
							label="Notes (optional)"
							value={props.notes}
							onChange={e => props.setNotes(e.target.value)}
							multiline
							minRows={3}/>
					</StyledPaper>
				</Stack>

				<Stack gap="16px" flex={1}>
					<StyledPaper>
						<Typography variant="h2">Invoice Details</Typography>
						
						<TextField
							label="Bill To"
							value={props.customerName}
							onChange={e => props.setCustomerName(e.target.value)}/>

						<TextField
							label="Address"
							value={props.projectAddress}
							onChange={e => props.setProjectAddress(e.target.value)}/>

						<Divider/>
						
						{/* Summary */}
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Subtotal</Typography>
							<Typography variant="body2">${parseFloat(invoice.items.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Tax</Typography>
							<Typography variant="body2">${parseFloat(invoice.items.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Total</Typography>
							<Typography variant="body2" style={{ fontWeight: 600 }}>${parseFloat(invoice.items.summary.total).toFixed(2)}</Typography>
						</Stack>
					</StyledPaper>
				</Stack>
			</Stack>
		</Stack>
	)
}


function CompanyForm(props){
	const [edit, setEdit] = useState(false);

	return(
		<StyledPaper>
			<Stack gap="16px" direction="row" justifyContent="space-between">
				<Typography variant="h2">Company</Typography>	
				<IconButton
					onClick={() => setEdit(!edit)}>
					<EditIcon/>
				</IconButton>
			</Stack>

			{
				!edit
					? (
						<Stack gap="16px">
							<Stack gap="8px">
								<Typography variant="h2">{props.company.name}</Typography>
								<Typography variant="body2">{props.company.email}</Typography>
								<Typography variant="body2">{props.company.phone}</Typography>
								<Typography variant="body2">{props.company.businessNumber}</Typography>
							</Stack>
						</Stack>
					)
					: (
						<Stack gap="16px">
							<TextField
								label="Company Name"
								value={props.company.name}
								onChange={e => props.updateCompany({ name: e.target.value })}/>
							
							<TextField
								label="Email"
								value={props.company.email}
								onChange={e => props.updateCompany({ email: e.target.value })}/>
							
							<TextField
								label="Phone"
								value={props.company.phone}
								onChange={e => props.updateCompany({ phone: e.target.value })}/>
							
							<TextField
								label="Business Number"
								value={props.company.businessNumber}
								onChange={e => props.updateCompany({ businessNumber: e.target.value })}/>
							
							<Stack gap="16px" direction="row" justifyContent="flex-end">
								<Button
									size="small">Cancel</Button>
								<Button
									size="small"
									variant="contained">Save</Button>
							</Stack>
						</Stack>
					)
			}
		</StyledPaper>			
	)
}

function InvoiceItem(props){
	// Add a new InvoiceItem if "enter" is pressed when typing in a TextField
	function handleEnterKeypress(e){
		if (e.key === 'Enter') {
			e.preventDefault();	// Prevent default action
			props.addNewItem();
		}
	}

	return(
		<TableRow>
			<TableCell>
				<TextField
					placeholder="Enter item"
					hiddenLabel
					fullWidth
					size="small"
					value={props.data.description}
					onKeyDown={handleEnterKeypress}
					onChange={e => props.setItemProperty("description", e.target.value)}
					autoFocus={props.autoFocus}/>
			</TableCell>

			<TableCell>
				<TextField
					placeholder="0"
					hiddenLabel
					type="number"
					fullWidth
					size="small"
					value={props.data.qty}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry
						if (e.target.value.match(/^(|\d)+$/)) {
							props.setItemProperty("qty", e.target.value);
							props.setItemProperty("amount", (props.data.rate * e.target.value));
						}
					}}
					slotProps={{
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell>
				<TextField
					placeholder="0.00"
					hiddenLabel
					fullWidth
					size="small"
					value={props.data.rate || ""}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry up to two decimal places
						if (e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)) {
							props.setItemProperty("rate", e.target.value);
							props.setItemProperty("amount", (e.target.value * props.data.qty));
						}
					}}
					slotProps={{
						input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell>
				<IconButton size="small" onClick={() => props.handleDelete(props.id)}>
					<DeleteIcon/>
				</IconButton>
			</TableCell>
		</TableRow>
	)
}
