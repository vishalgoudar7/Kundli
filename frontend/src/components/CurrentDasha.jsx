export default function CurrentDasha({data}){
 return <section className="card"><div className="section-title"><span>◉</span><div><h2>Current Dasha</h2><p>{data.asOf?new Date(data.asOf).toLocaleString():''}</p></div></div>
 <div className="dasha-current"><div><small>MAHADASHA</small><strong>{data.mahadasha||'—'}</strong><p>{fmt(data.mahadashaStart)} → {fmt(data.mahadashaEnd)}</p></div><div><small>ANTARDASHA</small><strong>{data.antardasha||'—'}</strong><p>{fmt(data.antardashaStart)} → {fmt(data.antardashaEnd)}</p></div></div></section>
}
const fmt=d=>d?new Date(d).toLocaleDateString(): '—';
