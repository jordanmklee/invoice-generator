import { Button, Stack } from '@mui/material';
import { TextField, IconButton, InputAdornment,  } from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Card, CardContent } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';


// Wrapper for MUI Textfield with styles and label
function FormTextfield(props){
	return(
		<Stack sx={{ flex: 1 }}>
			<Typography variant="overline" sx={{ color: "#969696" }}>{props.label}</Typography>
			<TextField
				size="small"
				placeholder={props.placeholder}
				value={props.value}
				onChange={e => props.onChange(e.target.value)}
				multiline={props.multiline}
				minRows={3}/>
		</Stack>
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


	return(
		<Stack gap="32px" sx={{ ...props.sx, padding: "32px" }}>
			<Card>
				<CardContent>
					<Stack padding="16px" gap="32px">
						<Typography variant="h5">Invoice Details</Typography>
						
						<Stack gap="32px" direction="row" >
							<Stack style={{ flex: 2 }}>
								<FormTextfield
									label="Company Name"
									value={props.companyName}
									onChange={props.setCompanyName}/>
							</Stack>

							<Stack gap="16px" style={{ flex: 1 }}>
								<Stack>
									<Typography variant="overline" sx={{ color: "#969696" }}>Date</Typography>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DatePicker
											slotProps={{ textField: { size: "small" } }}
											format="LL"
											value={props.date}
											onChange={e => props.setDate(e)}/>
									</LocalizationProvider>
								</Stack>

								<FormTextfield
									label="Invoice Number"
									value={props.invoiceNumber}
									onChange={props.setInvoiceNumber}/>
							</Stack>
						</Stack>

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
				</CardContent>
			</Card>

			<Stack gap="16px" direction="row" alignItems="flex-start" justifyContent="space-between">
				{/* Items Form */}
				<Card sx={{ flex: 3 }}>
					<CardContent>
						<Stack padding="16px" gap="16px">
							<Typography variant="h5">Items</Typography>

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

							<Button
								variant="text"
								startIcon={<AddIcon/>}
								onClick={addNewItem}>New Item</Button>
						</Stack>
					</CardContent>
				</Card>
				
				{/* Summary */}
				<Card sx={{ flex: 1 }}>
					<CardContent>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="body1" style={{ color: "#969696" }}>Subtotal</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="body1">${parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="body1" style={{ color: "#969696" }}>Tax</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="body1">${parseFloat(props.summary.tax).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="h6" style={{ color: "#969696" }}>Total</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="h6" style={{ fontWeight: 600 }}>${parseFloat(props.summary.total).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</Stack>
		</Stack>
	)
}

