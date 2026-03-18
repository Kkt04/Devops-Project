import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Package } from 'lucide-react';

const ARTISANS = [
  { name:'Maya Okonkwo', craft:'Ceramics & Pottery', location:'Lagos, Nigeria', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', bio:'Trained at the Royal College of Art, Maya brings West African geometric traditions into her wheel-thrown forms. Each piece is a conversation between past and present.', rating:4.9, products:24, speciality:'Hand-thrown stoneware', years:12, featured:true },
  { name:'Luna Reyes', craft:'Textile & Macramé', location:'Oaxaca, Mexico', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHb3NNAX1Nom9vUFN8xe_Eh9CdSSJQD2AAtw&s', bio:'Luna learned the art of fiber from her grandmother in the Sierra Norte mountains. She blends ancestral knotting techniques with contemporary minimal aesthetics.', rating:4.8, products:18, speciality:'Natural fibre wall art', years:8, featured:true },
  { name:'Hana Fujimoto', craft:'Bladesmithing', location:'Kyoto, Japan', avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300', bio:"Third-generation bladesmith trained under her father's watchful eye. Hana forges heirloom-quality kitchen knives that balance beauty with pure functional precision.", rating:5.0, products:11, speciality:'High-carbon kitchen knives', years:16, featured:true },
  { name:'Erik Lindqvist', craft:'Candle Making', location:'Gothenburg, Sweden', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300', bio:"Sustainable candlemaker sourcing beeswax directly from Scandinavian apiaries. Erik's work celebrates slow light and the beauty of natural materials.", rating:4.7, products:32, speciality:'Beeswax candles', years:6, featured:false },
  { name:'James Abara', craft:'Leatherwork', location:'Accra, Ghana', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', bio:'James hand-stitches every journal, bag, and wallet from full-grain hides sourced within Ghana. His work develops extraordinary patina over decades of use.', rating:4.9, products:15, speciality:'Full-grain leather goods', years:10, featured:false },
  { name:'Tom Wheeler', craft:'Wood Carving', location:'Vermont, USA', avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300', bio:'Tom carves from fallen timber he retrieves from local forests, wasting nothing. His wooden spoons and bowls have the character of the trees they came from.', rating:4.7, products:27, speciality:'Foraged hardwood utensils', years:14, featured:false },
];

function ArtisanCard({ artisan, featured }) {
  return (
    <div style={{ background:'var(--warm-white)', borderRadius:'var(--radius-lg)', border:'1px solid var(--mist)', overflow:'hidden', transition:'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='var(--shadow-xl)';e.currentTarget.style.borderColor='transparent';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='var(--mist)';}}>
      <div style={{ height: featured?120:80, background:'linear-gradient(135deg,var(--forest) 0%,var(--forest-light) 100%)', position:'relative' }}>
        <div style={{ position:'absolute', bottom:-30, left:24 }}>
          <img src={artisan.avatar} alt={artisan.name} style={{ width:featured?72:60, height:featured?72:60, borderRadius:'50%', objectFit:'cover', border:'3px solid var(--warm-white)', boxShadow:'var(--shadow-md)' }} />
        </div>
      </div>
      <div style={{ padding: featured?'42px 24px 24px':'38px 20px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:featured?'1.25rem':'1.1rem', fontWeight:700, marginBottom:2 }}>{artisan.name}</h3>
            <p style={{ fontSize:'0.78rem', color:'var(--clay)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{artisan.craft}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4, background:'var(--parchment)', padding:'4px 10px', borderRadius:20, fontSize:'0.8rem', fontWeight:600, flexShrink:0 }}>
            <Star size={12} style={{ color:'var(--gold)' }} fill="var(--gold)" />{artisan.rating}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, color:'var(--stone)', fontSize:'0.82rem', marginBottom:14 }}>
          <MapPin size={13}/>{artisan.location}
        </div>
        {featured && <p style={{ fontSize:'0.9rem', color:'var(--stone)', lineHeight:1.75, marginBottom:18 }}>{artisan.bio}</p>}
        <div style={{ display:'flex', gap:20, marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--mist)' }}>
          {[{val:artisan.products,label:'Products'},{val:`${artisan.years}yr`,label:'Experience'}].map(s=>(
            <div key={s.label}><div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem' }}>{s.val}</div><div style={{ fontSize:'0.75rem', color:'var(--stone)' }}>{s.label}</div></div>
          ))}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>Speciality</div>
            <div style={{ fontSize:'0.82rem', color:'var(--stone)' }}>{artisan.speciality}</div>
          </div>
        </div>
        <Link to={`/shop?search=${encodeURIComponent(artisan.name)}`}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', background:'var(--parchment)', borderRadius:'var(--radius-xl)', fontSize:'0.85rem', fontWeight:500, color:'var(--forest)', transition:'background 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--mist)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--parchment)'}>
          <Package size={14}/>View Products<ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  );
}

export default function Artisans() {
  const featured = ARTISANS.filter(a => a.featured);
  const rest = ARTISANS.filter(a => !a.featured);
  return (
    <main>
      <div style={{ background:'var(--parchment)', padding:'64px 0 48px', borderBottom:'1px solid var(--mist)' }}>
        <div className="container">
          <p className="section-eyebrow">The makers behind the magic</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.4rem,4vw,3.6rem)', fontWeight:700, letterSpacing:'-0.03em', maxWidth:640, lineHeight:1.1, marginTop:10 }}>
            Meet Our <em style={{ color:'var(--clay)', fontStyle:'italic' }}>Artisans</em>
          </h1>
          <p style={{ color:'var(--stone)', fontSize:'1.05rem', marginTop:18, maxWidth:540, lineHeight:1.75 }}>
            Every product on ArtisanHub is made by an independent maker with years of practiced skill.
          </p>
        </div>
      </div>
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div><p className="section-eyebrow">Spotlighted makers</p><h2 className="section-title">Featured Artisans</h2></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:28, marginBottom:72 }}>
            {featured.map(a => <ArtisanCard key={a.name} artisan={a} featured />)}
          </div>
          <div className="section-header">
            <div><p className="section-eyebrow">The full community</p><h2 className="section-title">All Makers</h2></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {rest.map(a => <ArtisanCard key={a.name} artisan={a} />)}
          </div>
        </div>
      </section>
      <div className="container" style={{ paddingBottom:80 }}>
        <div className="artisan-banner">
          <div>
            <span className="banner-tag">Open applications</span>
            <h2 className="banner-title">Your craft deserves<br/>a global stage</h2>
            <p className="banner-text">We&apos;re always looking for skilled artisans who pour genuine love into what they make. No listing fees, no algorithms — just a community that values craft.</p>
            <a href="#" className="btn-light">Apply to Join <ArrowRight size={16}/></a>
          </div>
          <div className="banner-images">
            <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" alt="" />
            <img src="https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400" alt="" />
            <img src="https://images.unsplash.com/photo-1604014137254-f9be42e6cbdf?w=400" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
}