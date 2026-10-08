'use client'
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <main style={{minHeight:'100svh',display:'grid',placeContent:'center',gap:'1.5rem',padding:'2rem',background:'#101612',color:'#edf0e8'}}><p>ARCHIVE CONNECTION INTERRUPTED</p><h1>The archive is still here.</h1><p>Open the complete portfolio in Quick View, or try the world again.</p><a href="/quick" style={{color:'#b5d5c1'}}>Open Quick View →</a><button onClick={reset} style={{padding:'1rem',border:'1px solid #617d6a'}}>Try again</button></main>
}
