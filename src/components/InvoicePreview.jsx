import { Stack } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import Summary from "./Summary";

export default function InvoicePreview(props){
	return(
		<Stack gap="64px" sx={{ ...props.sx, margin: "32px", padding: "32px" }}>
			<Typography variant="h5">{props.companyName}</Typography>
			<Typography variant="h6">{props.billTo}</Typography>
			<Typography variant="h6">{props.date.format("LL")}</Typography>
			<Typography variant="h6">{props.invoiceNumber}</Typography>
			<Typography variant="h6">{props.projectAddress}</Typography>
			<Typography variant="h6">{props.poNumber}</Typography>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Item</TableCell>
						<TableCell>Rate</TableCell>
						<TableCell>Qty</TableCell>
						<TableCell align="right">Amount</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						props.items.map((item, index) => (
							<TableRow>
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
	)
}