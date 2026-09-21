export default function SummaryCards({result}){
 const moon=result.planets?.find(p=>p.name==='Moon');
 const cards=[['Lagna',result.lagna?.sign],['Moon Sign',moon?.sign],['Nakshatra',moon?.nakshatra],['Pada',moon?.pada]];
 return <div className="summary">{cards.map(([a,b])=><div className="mini" key={a}><small>{a}</small><strong>{b??'—'}</strong></div>)}</div>
}
