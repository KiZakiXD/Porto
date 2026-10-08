import { ImageResponse } from 'next/og'
export const alt = 'KIZAKIXD — Orbital Works'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{display:'flex',position:'relative',width:'100%',height:'100%',background:'#080c0e',color:'#eeeee6',padding:66,fontFamily:'sans-serif',flexDirection:'column',justifyContent:'space-between',overflow:'hidden'}}>
    <div style={{display:'flex',position:'absolute',right:-20,top:85,width:590,height:590,borderRadius:'50%',background:'radial-gradient(circle at 28% 24%, #8b9d6b 0%, #335951 26%, #102526 60%, #080b0d 78%)',border:'1px solid #88a596'}} />
    <div style={{display:'flex',position:'absolute',right:-80,top:240,width:680,height:230,border:'1px solid #b5c9a77a',borderRadius:'50%',transform:'rotate(-24deg)'}} />
    <div style={{display:'flex',justifyContent:'space-between',fontSize:18,letterSpacing:4,color:'#9ba79c'}}><span>KIZAKIXD</span><span>ORBITAL WORKS / 01</span></div>
    <div style={{display:'flex',flexDirection:'column',position:'relative'}}><div style={{fontSize:90,letterSpacing:-6,lineHeight:1.06}}>A universe</div><div style={{fontSize:90,letterSpacing:-6,lineHeight:1.06}}>in progress.</div></div>
    <div style={{display:'flex',position:'relative',fontSize:18,color:'#b5c9ac',letterSpacing:2}}>ONCHAIN DEVELOPMENT · AI · EXPERIMENTS</div>
  </div>,size)
}
