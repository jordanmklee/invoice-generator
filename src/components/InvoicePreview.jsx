import { Stack, Divider } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function InvoicePreview(props){
	return(
		<Stack ref={props.pdfRef} sx={{ ...props.sx, padding: "64px" }}>
			<Stack style={{ padding: "64px", borderRadius: "4px", background: "white", gap: "32px" }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="h5" style={{ fontWeight: 600 }}>
						Invoice <span style={{ color: "blue" }}>{props.invoiceNumber ? "#" + props.invoiceNumber : <></> }</span>
					</Typography>
					<div>
						{
							props.date
								? <Typography>{props.date.format("LL")}</Typography>
								: <></>
						}
					</div>
				</Stack>

				<Divider/>

				<Stack direction="row" gap="64px">
					<div>
						<Typography variant="body2" style={{ color: "grey" }}>Bill From</Typography>
						{
							props.companyName
								? <Typography>{props.companyName}</Typography>
								: <></>
						}
					</div>

					<Stack gap="12px">
						{
							props.billTo
								? (
									<div>
										<Typography variant="body2" style={{ color: "grey" }}>Bill To</Typography>
										<Typography>{props.billTo}</Typography>
									</div>
								)
								: <></>
						}
						{
							props.projectAddress
								? (
									<div>
										<Typography variant="body2" style={{ color: "grey" }}>Address</Typography>
										<Typography>{props.projectAddress}</Typography>
									</div>
								)
								: <></>
						}
					</Stack>
					{
						props.poNumber
							? <Typography>{props.poNumber}</Typography>
							: <></>
					}
				</Stack>

				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: "grey", width: "50%" }}>Item</TableCell>
							<TableCell sx={{ color: "grey" }}>Rate</TableCell>
							<TableCell sx={{ color: "grey" }}>Qty</TableCell>
							<TableCell sx={{ color: "grey" }} align="right">Amount</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{
							props.items.map((item, index) => (
								<TableRow key={index}>
									<TableCell>
										<Typography>{item.description}</Typography>
									</TableCell>
									<TableCell>
										<Typography>$ {parseFloat(item.rate).toFixed(2)}</Typography>
									</TableCell>
									<TableCell>
										<Typography>{item.qty}</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography>$ {parseFloat(item.amount).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>
							))
						}
					
						<Summary data={props.summary}/>
					</TableBody>
				</Table>
			</Stack>
		</Stack>
	)
}


function Summary(props){
	return(
		<>
			<TableRow>
				<TableCell rowSpan={4} colSpan={2}/>
				<TableCell>
					<Typography variant="body1">Subtotal</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1">$ {parseFloat(props.data.subtotal).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>
					<Typography variant="body1">Tax</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1">$ {parseFloat(props.data.tax).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>
					<Typography variant="h6" style={{ fontWeight: 600 }}>Total</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="h6" style={{ fontWeight: 600 }}>$ {parseFloat(props.data.total).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
		</>
	)
}