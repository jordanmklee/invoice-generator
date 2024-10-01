import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Table, TableHeader, TableBody, TableCell, DataTableCell } from "@david.kucsai/react-pdf-table";


export default function GeneratedDocument(props){
	const styles = StyleSheet.create({
		page: { backgroundColor: 'white' },
		section: { margin: "1in", fontSize: "12pt" },
		title: { fontSize: "16pt" },
		cell: { padding: "4px", fontSize: "10pt" }
	});
	
	
	const parsedDate = props.date.format("LL");


	return(
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Text style={styles.title}>{props.companyName}</Text>
					
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text>{props.projectAddress}</Text>
						<View style={{ flexDirection: "row", gap: "0.5in" }}>
							<Text>{parsedDate}</Text>
							<Text>{props.invoiceNumber}</Text>
						</View>
					</View>
					
					<Text>{props.billTo}</Text>
					
					<Text>{props.poNumber}</Text>
				</View>

				<View style={{...styles.section, alignItems: "flex-end" }}>
					<Table data={props.items}>
						<TableHeader>
							<TableCell style={styles.cell} weighting={0.5}>Description</TableCell>
							<TableCell style={styles.cell} weighting={0.2}>Rate</TableCell>
							<TableCell style={styles.cell} weighting={0.1}>Qty</TableCell>
							<TableCell style={{...styles.cell, alignItems: "flex-end" }} weighting={0.2}>Amount</TableCell>
						</TableHeader>

						<TableBody>
							<DataTableCell
								getContent={r => r.description}
								style={styles.cell}
								weighting={0.50}/>
							<DataTableCell
								getContent={r => ("$" + parseFloat(r.rate).toFixed(2))}
								style={styles.cell}
								weighting={0.2}/>
							<DataTableCell
								getContent={r => r.qty}
								style={styles.cell}
								weighting={0.1}/>
							<DataTableCell
								getContent={r => ("$" + parseFloat(r.amount).toFixed(2))}
								style={{ ...styles.cell, alignItems: "flex-end" }}
								weighting={0.2}/>
						</TableBody>
					</Table>

					<View style={{ width: "50%", paddingTop: "0.5in" }}>
						<Table>
							<TableHeader>
								<TableCell style={styles.cell}>Subtotal</TableCell>
								<TableCell style={{ ...styles.cell, alignItems: "flex-end" }}>
									<Text>
										${parseFloat(props.summary.subtotal).toFixed(2)}
									</Text>
								</TableCell>
							</TableHeader>
						</Table>
					</View>
					<View style={{ width: "50%" }}>
						<Table>
							<TableHeader>
								<TableCell style={styles.cell}>Tax</TableCell>
								<TableCell style={{ ...styles.cell, alignItems: "flex-end" }}>
									<Text>
										${parseFloat(props.summary.tax).toFixed(2)}
									</Text>
								</TableCell>
							</TableHeader>
						</Table>
					</View>
					<View style={{ width: "50%" }}>
						<Table>
							<TableHeader>
								<TableCell style={styles.cell}>Total</TableCell>
								<TableCell style={{ ...styles.cell, alignItems: "flex-end" }}>
									<Text>
										 ${parseFloat(props.summary.total).toFixed(2)}
									</Text>
								</TableCell>
							</TableHeader>
						</Table>
					</View>
				</View>
			</Page>
		</Document>
	)
}