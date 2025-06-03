import { Button, Stack, Divider } from '@mui/material';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';

import generatePDF from '../PDFGenerator';


// Wrapper for MUI Textfield with styles
function FormTextfield(props){
	return(
		<TextField
			variant="filled"
			slotProps={{ input: { disableUnderline: true } }}
			fullWidth
			size="small"
			label={props.label}
			value={props.value}
			onChange={e => props.onChange(e.target.value)}
			multiline={props.multiline}
			minRows={3}/>
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
			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					fullWidth
					size="small"
					value={props.data.description}
					onKeyDown={handleEnterKeypress}
					onChange={e => props.setItemProperty("description", e.target.value)}
					autoFocus={props.autoFocus}/>
			</TableCell>

			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					placeholder="0"
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

			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					placeholder="0.00"
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

			<TableCell sx={{ borderBottom: "none" }}>
				<IconButton size="small" onClick={() => props.handleDelete(props.id)}>
					<CloseIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	)
}


export default function Form(props){
	function addNewItem(){
		props.setItems([...props.items, { description: "", qty: 1, rate: 0.00, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...props.items];
		temp.splice(index, 1);
		props.setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...props.items];
		temp[index][property] = value;
		props.setItems(temp);
	}


	function handleGeneratePDFClick(){
		generatePDF(
			props.companyName,
			props.companyEmail,
			props.companyPhone,
			props.companyBusinessNumber,
			props.date,
			props.invoiceNumber,
			props.customerName,
			props.projectAddress,
			props.notes,
			props.items,
			props.summary
		)
	}


	return(
		<Stack gap="32px" direction="row" paddingTop="32px" sx={{ ...props.sx }}>
			<Stack gap="48px" flex={3}>
				<Stack gap="24px">
					<Typography variant="h6">Company</Typography>
					<FormTextfield
						label="Company Name"
						value={props.companyName}
						onChange={props.setCompanyName}/>
					
					<FormTextfield
						label="Email"
						value={props.companyEmail}
						onChange={props.setCompanyEmail}/>
					
					<FormTextfield
						label="Phone"
						value={props.companyPhone}
						onChange={props.setCompanyPhone}/>
					
					<FormTextfield
						label="Business Number"
						value={props.companyBusinessNumber}
						onChange={props.setCompanyBusinessNumber}/>
				</Stack>

				<Divider/>

				<Stack gap="24px">
					<Typography variant="h6">Invoice Details</Typography>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							format="LL"
							label="Date"
							value={props.date}
							onChange={e => props.setDate(e)}
							slotProps={{
								textField: {
									size: "small",
									variant: 'filled',
									InputProps: {
										disableUnderline: true,
									},
								}
							}} />
					</LocalizationProvider>

					<FormTextfield
						label="Invoice Number"
						value={props.invoiceNumber}
						onChange={props.setInvoiceNumber}/>

					<Stack gap="32px" direction="row">
						<FormTextfield
							label="Bill To"
							value={props.customerName}
							onChange={props.setCustomerName}/>

						<FormTextfield
							label="Address"
							value={props.projectAddress}
							onChange={props.setProjectAddress}/>
					</Stack>

					<FormTextfield
							label="Notes (optional)"
							value={props.notes}
							onChange={props.setNotes}
							multiline/>
				</Stack>
			</Stack>

			<Stack gap="16px" flex={2}>
				{/* Items Form */}
				<Stack gap="16px">
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="h5">Items</Typography>
						<Button
							variant="text"
							size="small"
							startIcon={<AddIcon />}
							onClick={addNewItem}>New Item</Button>
					</Stack>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell sx={{ width: "50%" }}>
									<Typography variant="overline" sx={{ color: "#969696" }}>Description</Typography>
								</TableCell>
								<TableCell sx={{ width: "15%" }}>
									<Typography variant="overline" sx={{ color: "#969696" }}>Quantity</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="overline" sx={{ color: "#969696" }}>Rate</Typography>
								</TableCell>
								<TableCell/>
							</TableRow>
							{
								props.items.map((item, index) => (
									<InvoiceItem
										key={index}
										id={index}
										data={item}
										setItemProperty={(property, value) => setItemProperty(property, value, index)}
										handleDelete={deleteItem}
										// Autofocus newly added items
										autoFocus={ (index === props.items.length - 1) && index !== 0 }
										addNewItem={addNewItem}/>
								))
							}
						</TableBody>
					</Table>

					
				</Stack>
				
				{/* Summary */}
				<Stack gap="32px">
					<Stack gap="16px">
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body1" style={{ color: "#969696" }}>Subtotal</Typography>
							<Typography variant="body1">${parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body1" style={{ color: "#969696" }}>Tax</Typography>
							<Typography variant="body1">${parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between" paddingTop="16px">
							<Typography variant="h6" style={{ color: "#969696" }}>Total</Typography>
							<Typography variant="h6" style={{ fontWeight: 600 }}>${parseFloat(props.summary.total).toFixed(2)}</Typography>
						</Stack>
					</Stack>

					<Button
						fullWidth
						variant="contained"
						onClick={handleGeneratePDFClick}>Generate PDF</Button>
				</Stack>
			</Stack>
		</Stack>
	)
}

