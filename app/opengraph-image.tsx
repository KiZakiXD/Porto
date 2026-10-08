import { ImageResponse } from 'next/og'
export const alt = 'KIZAKIXD — The Developer Archive'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',background:'#101612',color:'#ecece4',padding:68,fontFamily:'sans-serif',flexDirection:'column',justifyContent:'space-between'}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:15,letterSpacing:4,color:'#a1b4a8'}}><span>ARCHIVE INITIALIZED</span><span>EST. IN CURIOSITY</span></div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}><div style={{fontSize:100,fontWeight:700,letterSpacing:-7}}>KIZAKIXD</div><div style={{fontSize:43,color:'#b5ccbc'}}>The Developer Archive</div></div>
    <div style={{display:'flex',borderTop:'1px solid #39453d',paddingTop:25,justifyContent:'space-between',fontSize:19,color:'#a1b4a8'}}><span>AI systems · Automation · Onchain experiments</span><span>kizakixd.my.id</span></div>
  </div>,size)
}
