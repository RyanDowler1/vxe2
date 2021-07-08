import React from 'react';

const spinningCircle = (props) => {
  return (
    // <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
    //   <div id="loading-wrapper" className="loading-wrapper ss">
    //     <div className='loader'>
    //       <div className='brand'>
    //         <svg
    //           width='30px'
    //           height='30px'
    //           viewBox='0 0 45 45'
    //           version='1.1'
    //           xmlns='http://www.w3.org/2000/svg'
    //           xmlnsXlink='http://www.w3.org/1999/xlink'
    //         >
    //           <defs>
    //             <rect
    //               id='path-1'
    //               x='0'
    //               y='0'
    //               width='45'
    //               height='45'
    //               rx='22.5'
    //             ></rect>
    //           </defs>
    //           <g
    //             id='Books'
    //             stroke='none'
    //             strokeWidth='1'
    //             fill='none'
    //             fillRule='evenodd'
    //           >
    //             <g
    //               id='brand'
    //               transform='translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) '
    //             >
    //               <mask id='mask-2' fill='white'>
    //                 <use xlinkHref='#path-1'></use>
    //               </mask>
    //               <use
    //                 id='Rectangle-2'
    //                 fill='#EC662F'
    //                 xlinkHref='#path-1'
    //               ></use>
    //               <path
    //                 d='M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z'
    //                 id='Rectangle-3'
    //                 fill='#FCBF00'
    //                 mask='url(#mask-2)'
    //               ></path>
    //             </g>
    //           </g>
    //         </svg>
    //       </div>
    //       <p>{props.loadingText}</p>
    //     </div>
    //   </div>
    // </div>
    <div id="loading-wrapper" className="ss">
      <div className="loader">
        <div className="brand">
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 45 45"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <rect
                id="path-1"
                x="0"
                y="0"
                width="45"
                height="45"
                rx="22.5"
              ></rect>
            </defs>
            <g
              id="Books"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="brand"
                transform="translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) "
              >
                <mask id="mask-2" fill="white">
                  <use xlinkHref="#path-1"></use>
                </mask>
                <use id="Rectangle-2" fill="#EC662F" xlinkHref="#path-1"></use>
                <path
                  d="M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z"
                  id="Rectangle-3"
                  fill="#FCBF00"
                  mask="url(#mask-2)"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default spinningCircle;
