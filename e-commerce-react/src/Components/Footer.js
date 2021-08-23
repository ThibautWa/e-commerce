import React from 'react';
import bgneon from '../images/bg-neon.png';
import heart from '../images/heart.png';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

function Footer(){
    const mystyle= {
        footer:{
            boxSizing:'border-box',
            padding:'0',
            margin:'0',
            fontFamily:'roboto, sans-serif',
            color:'white',
            fontSize:'1em'
        },
        footerTop:{
            padding:'1em',
            backgroundColor:'rgba(43,24,39)',
            display:'flex',
        },
        footerTopNav:{
            
        },
        footerTopPart:{
            padding:'0 1em 0 1em'
        },
        footerTopList:{
            margin:'0',
            padding:'0'
        },
        footerTopListElement:{
            listStyle:'none',
            display:'block',
            paddingLeft:'5px'
        },
        footerTopListElementA:{
            textDecoration:'none',
            color:'unset'
        },
        footerBottom:{
            backgroundColor:'red',
            textAlign: 'center',
            background: `url('${bgneon}'),radial-gradient(circle, rgba(134,40,114,0) 50%, rgba(0,0,0,1) 90%), linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(61,0,48,1) 100%)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        },
        footerBottomP:{
            margin:'0',
            color: 'white',
            padding:'5em 3em 5em 3em',
        },
        footerBottomEmote:{
            height:'12px',
            position:'relative',
            top:'2px'

        }
    };
    return (
        <Box>
            <Container max-width="sm">
                <div style={mystyle.footer}>
                    <div style={mystyle.footerTop}>
                        <div style={mystyle.footerTopPart}>
                            <h3>A propos</h3>
                            <p style={mystyle.footerTopListElement}>Retrowave est un site de vente d'objet dit "eighties" créé en 2021 par un groupe d'étudiant d'Epitech (Thibaut Jager, Nicolas-andrei Corlan, Hugo Kerivel-larrivière, Floran Lebreton, François Vérin) dans le cadre du projet e-commerce.</p>
                        </div>
                        {/* <div style={mystyle.footerTopPart}>
                            <h3>Produits</h3>
                            <ul style={mystyle.footerTopList}>
                                <li style={mystyle.footerTopListElement}><a style={mystyle.footerTopListElementA} href="/home">Produit1</a></li>
                                <li style={mystyle.footerTopListElement}><a style={mystyle.footerTopListElementA} href="/home">Produit2</a></li>
                                <li style={mystyle.footerTopListElement}><a style={mystyle.footerTopListElementA} href="/home">Produit3</a></li>
                                <li style={mystyle.footerTopListElement}><a style={mystyle.footerTopListElementA} href="/home">Produit4</a></li>
                                <li style={mystyle.footerTopListElement}><a style={mystyle.footerTopListElementA} href="/home">Produit5</a></li>
                            </ul>
                        </div> */}
                    </div>
                    <div style={mystyle.footerBottom}>
                        <p style={mystyle.footerBottomP}>COPYRIGHT RetroWave 2021</p>
                    </div>
                </div>
            </Container>
        </Box>
    );
}

export default Footer