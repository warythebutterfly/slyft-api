const forgotPasswordEmailTemplate = function (otp: string, firstname: string) {
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <html lang="en">
      <head data-id="__react-email-head"></head>
      <div
        id="__react-email-preview"
        style="
          display: none;
          overflow: hidden;
          line-height: 1px;
          opacity: 0;
          max-height: 0;
          max-width: 0;
        "
      >
        Preview Text will be here
        <div>
           ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏  ‌ ‍‎‏ 
        </div>
      </div>
    
      <body
        data-id="__react-email-body"
        style="
          background-color: rgb(229, 231, 235);
          margin-top: auto;
          margin-bottom: auto;
          margin-left: auto;
          margin-right: auto;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
            Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        "
      >
        <table
          align="center"
          width="100%"
          data-id="__react-email-container"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 640px;
            background-color: rgb(255, 255, 255);
            border-radius: 0.25rem;
            margin-top: 40px;
            margin-bottom: 40px;
            margin-left: auto;
            margin-right: auto;
          "
        >
          <tbody>
            <tr style="width: 100%">
              <td>
                <table
                  align="center"
                  width="100%"
                  data-id="react-email-section"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    border-bottom-width: 1px;
                    border-style: solid;
                    border-bottom-color: rgb(235, 236, 239);
                    padding-top: 1.5rem;
                    padding-bottom: 1.5rem;
                    padding-left: 2.75rem;
                    padding-right: 2.75rem;
                  "
                >
                  <tbody>
                    <tr>
                      <td>
                        <img
                          data-id="react-email-img"
                          alt="Slyft"
                          src="http://localhost:3002/static/Slyft-logo.png"
                          width="150"
                          height="31"
                          style="
                            display: block;
                            outline: none;
                            border: none;
                            text-decoration: none;
                            margin-top: 0px;
                            margin-bottom: 0px;
                            margin-left: auto;
                            margin-right: auto;
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  width="100%"
                  data-id="react-email-section"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    padding-top: 3rem;
                    padding-bottom: 3rem;
                    padding-left: 2.75rem;
                    padding-right: 2.75rem;
                  "
                >
                  <tbody>
                    <tr>
                      <td>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 1.25rem;
                            line-height: 1.75rem;
                            margin: 16px 0;
                            font-weight: 500;
                            color: rgb(23, 24, 28);
                            margin-bottom: 1.5rem;
                          "
                        >
                          OTP
                        </p>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 14px;
                            line-height: 24px;
                            margin: 16px 0;
                            margin-bottom: 0.25rem;
                            color: rgb(23, 24, 28);
                          "
                        >
                         Hi ${firstname ? firstname : "there"},
                        </p>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 14px;
                            line-height: 24px;
                            margin: 16px 0;
                            margin-bottom: 1.5rem;
                            color: rgb(23, 24, 28);
                          "
                        >
                          You requested to change your password. Use the following
                          verification code below to reset your password:
                        </p>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 1rem;
                            line-height: 1.5rem;
                            margin: 16px 0;
                            font-weight: 500;
                            color: rgb(23, 24, 28);
                            margin-bottom: 1.5rem;
                          "
                        >
                          ${otp}
                        </p>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 0.875rem;
                            line-height: 1.25rem;
                            margin: 0px;
                            color: rgb(116, 122, 139);
                          "
                        >
                          Thanks,
                        </p>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 0.875rem;
                            line-height: 1.25rem;
                            margin: 0px;
                            color: rgb(23, 24, 28);
                            font-weight: 500;
                          "
                        >
                        The Slyft Team
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  width="100%"
                  data-id="react-email-section"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="
                    background-color: rgb(6, 129, 62);
                    padding-left: 2.75rem;
                    padding-right: 2.75rem;
                    padding-top: 30px;
                    padding-bottom: 30px;
                    border-bottom-left-radius: 0.25rem;
                    border-bottom-right-radius: 0.25rem;
                  "
                >
                  <tbody>
                    <tr>
                      <td>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 0.75rem;
                            line-height: 1rem;
                            margin: 16px 0;
                            text-align: center;
                            color: rgb(255, 255, 255);
                            font-weight: 400;
                          "
                        >
                          Slyft aims to sed ut perspiciatis unde omnis iste
                          natus error sit voluptatem accusantium doloremque
                          laudantium, to
                        </p>
                        <table
                          align="center"
                          width="100%"
                          data-id="react-email-section"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="margin-top: 1.5rem; margin-bottom: 1.5rem"
                        >
                          <tbody>
                            <tr>
                              <td>
                                <div
                                  style="
                                    display: flex;
                                    gap: 0.75rem;
                                    align-items: center;
                                    justify-content: center;
                                  "
                                >
                                  <a
                                    href="https://facebook.com"
                                    data-id="react-email-link"
                                    target="_blank"
                                    style="
                                      color: #067df7;
                                      text-decoration: none;
                                      background-color: rgb(255, 255, 255);
                                      width: 2.25rem;
                                      height: 2.25rem;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                      border-radius: 9999px;
                                    "
                                    ><svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="21"
                                      viewBox="0 0 20 21"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_1291_20384)">
                                        <path
                                          d="M17 0.467773H3C1.34315 0.467773 0 1.81092 0 3.46777V17.4678C0 19.1246 1.34315 20.4678 3 20.4678H17C18.6569 20.4678 20 19.1246 20 17.4678V3.46777C20 1.81092 18.6569 0.467773 17 0.467773Z"
                                          fill="#3B5998"
                                        ></path>
                                        <path
                                          d="M11.2109 18.2803V6.60059C11.2109 5.78027 11.4453 5.2334 12.5781 5.2334H14.0625V2.77246C13.7891 2.7334 12.9297 2.65527 11.9141 2.65527C9.80469 2.65527 8.35938 3.94434 8.35938 6.32715V18.2803M13.9453 8.3584H5.9375V11.1709H13.5938"
                                          fill="white"
                                        ></path>
                                      </g>
                                      <defs>
                                        <clippath id="clip0_1291_20384">
                                          <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0 0.467773)"
                                          ></rect>
                                        </clippath>
                                      </defs></svg></a
                                  ><a
                                    href="https://twitter.com"
                                    data-id="react-email-link"
                                    target="_blank"
                                    style="
                                      color: #067df7;
                                      text-decoration: none;
                                      background-color: rgb(255, 255, 255);
                                      width: 2.25rem;
                                      height: 2.25rem;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                      border-radius: 9999px;
                                    "
                                    ><svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="21"
                                      viewBox="0 0 20 21"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_1291_20388)">
                                        <path
                                          d="M17 0.467773H3C1.34315 0.467773 0 1.81092 0 3.46777V17.4678C0 19.1246 1.34315 20.4678 3 20.4678H17C18.6569 20.4678 20 19.1246 20 17.4678V3.46777C20 1.81092 18.6569 0.467773 17 0.467773Z"
                                          fill="#1DA1F2"
                                        ></path>
                                        <path
                                          d="M17.0703 6.4053C16.6016 6.63968 16.0547 6.79593 15.5078 6.87405C16.0938 6.52249 16.5234 5.97561 16.7578 5.31155C16.2109 5.62405 15.625 5.85843 15 5.97561C14.5749 5.54024 14.0201 5.25446 13.4188 5.16118C12.8175 5.0679 12.2022 5.17213 11.6652 5.45825C11.1281 5.74437 10.6984 6.19693 10.4404 6.74802C10.1824 7.29912 10.1101 7.91901 10.2344 8.51468C8.04688 8.39749 5.9375 7.38186 4.57031 5.62405C4.38428 5.92118 4.2589 6.2522 4.20141 6.59802C4.14392 6.94383 4.15545 7.29761 4.23534 7.63895C4.31523 7.98029 4.46189 8.30244 4.66688 8.58683C4.87186 8.87122 5.13112 9.11221 5.42969 9.29593C5 9.29593 4.57031 9.2178 4.17969 9.02249C4.21875 10.3116 5.11719 11.4444 6.36719 11.7178C5.97656 11.835 5.54688 11.835 5.11719 11.7569C5.50781 12.8897 6.5625 13.6709 7.73438 13.71C6.60156 14.6475 5.07812 15.0772 3.63281 14.8428C4.84059 15.6487 6.24996 16.1003 7.70121 16.1463C9.15247 16.1923 10.5876 15.8309 11.844 15.1031C13.1004 14.3753 14.1278 13.3101 14.8099 12.0283C15.492 10.7465 15.8014 9.29927 15.7031 7.85061C16.25 7.45999 16.7188 6.99124 17.0703 6.4053Z"
                                          fill="white"
                                        ></path>
                                      </g>
                                      <defs>
                                        <clippath id="clip0_1291_20388">
                                          <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0 0.467773)"
                                          ></rect>
                                        </clippath>
                                      </defs></svg></a
                                  ><a
                                    href="https://instagram.com"
                                    data-id="react-email-link"
                                    target="_blank"
                                    style="
                                      color: #067df7;
                                      text-decoration: none;
                                      background-color: rgb(255, 255, 255);
                                      width: 2.25rem;
                                      height: 2.25rem;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                      border-radius: 9999px;
                                    "
                                    ><svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="21"
                                      viewBox="0 0 20 21"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_1291_20392)">
                                        <path
                                          d="M10.0031 0.467773C5.82853 0.467773 4.60744 0.47207 4.36994 0.491602C3.5133 0.563086 2.98009 0.697852 2.39923 0.987305C1.95158 1.20957 1.59845 1.46738 1.25041 1.82871C0.615641 2.4873 0.231266 3.29785 0.0922037 4.26113C0.0246256 4.72871 0.00470369 4.82441 0.000797441 7.21348C-0.000765059 8.00996 0.000797441 9.05801 0.000797441 10.4639C0.000797441 14.6365 0.00548494 15.8564 0.0254068 16.0936C0.0945474 16.9275 0.225407 17.4521 0.50236 18.026C1.03166 19.1244 2.0422 19.949 3.23244 20.2568C3.64455 20.3631 4.10002 20.4213 4.68439 20.449C4.93205 20.46 7.45627 20.4674 9.98205 20.4674C12.5078 20.4674 15.0332 20.4643 15.275 20.4521C15.952 20.4201 16.3449 20.3674 16.7793 20.2553C17.9774 19.9459 18.9695 19.1338 19.5094 18.0197C19.7809 17.4596 19.9184 16.915 19.9809 16.1248C19.9945 15.9525 20 13.2049 20 10.4611C20 7.71699 19.9938 4.97441 19.9805 4.80215C19.9176 3.99902 19.7797 3.45879 19.4996 2.88809C19.2695 2.4209 19.0145 2.07168 18.6438 1.71504C17.982 1.08301 17.1731 0.698242 16.209 0.55918C15.7414 0.491992 15.6485 0.47207 13.2582 0.467773H10.0031Z"
                                          fill="url(#paint0_radial_1291_20392)"
                                        ></path>
                                        <path
                                          d="M10.0031 0.467773C5.82853 0.467773 4.60744 0.47207 4.36994 0.491602C3.5133 0.563086 2.98009 0.697852 2.39923 0.987305C1.95158 1.20957 1.59845 1.46738 1.25041 1.82871C0.615641 2.4873 0.231266 3.29785 0.0922037 4.26113C0.0246256 4.72871 0.00470369 4.82441 0.000797441 7.21348C-0.000765059 8.00996 0.000797441 9.05801 0.000797441 10.4639C0.000797441 14.6365 0.00548494 15.8564 0.0254068 16.0936C0.0945474 16.9275 0.225407 17.4521 0.50236 18.026C1.03166 19.1244 2.0422 19.949 3.23244 20.2568C3.64455 20.3631 4.10002 20.4213 4.68439 20.449C4.93205 20.46 7.45627 20.4674 9.98205 20.4674C12.5078 20.4674 15.0332 20.4643 15.275 20.4521C15.952 20.4201 16.3449 20.3674 16.7793 20.2553C17.9774 19.9459 18.9695 19.1338 19.5094 18.0197C19.7809 17.4596 19.9184 16.915 19.9809 16.1248C19.9945 15.9525 20 13.2049 20 10.4611C20 7.71699 19.9938 4.97441 19.9805 4.80215C19.9176 3.99902 19.7797 3.45879 19.4996 2.88809C19.2695 2.4209 19.0145 2.07168 18.6438 1.71504C17.982 1.08301 17.1731 0.698242 16.209 0.55918C15.7414 0.491992 15.6485 0.47207 13.2582 0.467773H10.0031Z"
                                          fill="url(#paint1_radial_1291_20392)"
                                        ></path>
                                        <path
                                          d="M10.0031 0.467773C5.82853 0.467773 4.60744 0.47207 4.36994 0.491602C3.5133 0.563086 2.98009 0.697852 2.39923 0.987305C1.95158 1.20957 1.59845 1.46738 1.25041 1.82871C0.615641 2.4873 0.231266 3.29785 0.0922037 4.26113C0.0246256 4.72871 0.00470369 4.82441 0.000797441 7.21348C-0.000765059 8.00996 0.000797441 9.05801 0.000797441 10.4639C0.000797441 14.6365 0.00548494 15.8564 0.0254068 16.0936C0.0945474 16.9275 0.225407 17.4521 0.50236 18.026C1.03166 19.1244 2.0422 19.949 3.23244 20.2568C3.64455 20.3631 4.10002 20.4213 4.68439 20.449C4.93205 20.46 7.45627 20.4674 9.98205 20.4674C12.5078 20.4674 15.0332 20.4643 15.275 20.4521C15.952 20.4201 16.3449 20.3674 16.7793 20.2553C17.9774 19.9459 18.9695 19.1338 19.5094 18.0197C19.7809 17.4596 19.9184 16.915 19.9809 16.1248C19.9945 15.9525 20 13.2049 20 10.4611C20 7.71699 19.9938 4.97441 19.9805 4.80215C19.9176 3.99902 19.7797 3.45879 19.4996 2.88809C19.2695 2.4209 19.0145 2.07168 18.6438 1.71504C17.982 1.08301 17.1731 0.698242 16.209 0.55918C15.7414 0.491992 15.6485 0.47207 13.2582 0.467773H10.0031Z"
                                          fill="url(#paint2_radial_1291_20392)"
                                        ></path>
                                        <path
                                          d="M10.0031 0.467773C5.82853 0.467773 4.60744 0.47207 4.36994 0.491602C3.5133 0.563086 2.98009 0.697852 2.39923 0.987305C1.95158 1.20957 1.59845 1.46738 1.25041 1.82871C0.615641 2.4873 0.231266 3.29785 0.0922037 4.26113C0.0246256 4.72871 0.00470369 4.82441 0.000797441 7.21348C-0.000765059 8.00996 0.000797441 9.05801 0.000797441 10.4639C0.000797441 14.6365 0.00548494 15.8564 0.0254068 16.0936C0.0945474 16.9275 0.225407 17.4521 0.50236 18.026C1.03166 19.1244 2.0422 19.949 3.23244 20.2568C3.64455 20.3631 4.10002 20.4213 4.68439 20.449C4.93205 20.46 7.45627 20.4674 9.98205 20.4674C12.5078 20.4674 15.0332 20.4643 15.275 20.4521C15.952 20.4201 16.3449 20.3674 16.7793 20.2553C17.9774 19.9459 18.9695 19.1338 19.5094 18.0197C19.7809 17.4596 19.9184 16.915 19.9809 16.1248C19.9945 15.9525 20 13.2049 20 10.4611C20 7.71699 19.9938 4.97441 19.9805 4.80215C19.9176 3.99902 19.7797 3.45879 19.4996 2.88809C19.2695 2.4209 19.0145 2.07168 18.6438 1.71504C17.982 1.08301 17.1731 0.698242 16.209 0.55918C15.7414 0.491992 15.6485 0.47207 13.2582 0.467773H10.0031Z"
                                          fill="url(#paint3_radial_1291_20392)"
                                        ></path>
                                        <path
                                          d="M10.0048 3.03613C7.98526 3.03613 7.73174 3.04512 6.93877 3.08105C6.14698 3.11738 5.60674 3.24238 5.13409 3.42637C4.64502 3.61621 4.23018 3.87012 3.8169 4.28301C3.40323 4.6959 3.14932 5.11074 2.9587 5.59902C2.77432 6.07168 2.64893 6.61191 2.61338 7.40254C2.57784 8.19512 2.56846 8.44863 2.56846 10.4666C2.56846 12.4846 2.57745 12.7373 2.61338 13.5299C2.64971 14.3209 2.7751 14.8607 2.9587 15.3334C3.14893 15.8221 3.40284 16.2365 3.81651 16.6498C4.22979 17.0631 4.64463 17.3178 5.13331 17.5076C5.60635 17.6912 6.14698 17.8166 6.93838 17.8529C7.73174 17.8889 7.98487 17.8979 10.0044 17.8979C12.0239 17.8979 12.2767 17.8889 13.07 17.8529C13.8618 17.8166 14.4028 17.6916 14.8759 17.5076C15.3649 17.3178 15.779 17.0635 16.1923 16.6502C16.606 16.2373 16.8599 15.8225 17.0505 15.3342C17.2333 14.8615 17.3587 14.3213 17.3958 13.5307C17.4314 12.7381 17.4407 12.4854 17.4407 10.4674C17.4407 8.44941 17.4314 8.1959 17.3958 7.40332C17.3587 6.6123 17.2333 6.07246 17.0505 5.5998C16.8599 5.11113 16.606 4.69668 16.1923 4.2834C15.7786 3.87012 15.3649 3.61621 14.8755 3.42637C14.4013 3.24277 13.8606 3.11738 13.0692 3.08105C12.2759 3.04512 12.0235 3.03613 10.0032 3.03613H10.0048ZM9.33799 4.3752C9.53604 4.3748 9.75674 4.3752 10.0052 4.3752C11.9907 4.3752 12.2259 4.38223 13.0099 4.41777C13.7349 4.45098 14.1282 4.57207 14.3903 4.67363C14.7372 4.8084 14.9849 4.96934 15.245 5.22949C15.5052 5.48965 15.6665 5.7373 15.8017 6.08418C15.9036 6.3459 16.0247 6.73887 16.0579 7.46348C16.0935 8.24668 16.1013 8.48223 16.1013 10.465C16.1013 12.4482 16.0935 12.6834 16.0579 13.4666C16.0247 14.1912 15.9036 14.5842 15.8017 14.8459C15.6669 15.1928 15.5056 15.4396 15.245 15.6994C14.9849 15.9596 14.7376 16.1205 14.3903 16.2553C14.1286 16.3576 13.7349 16.4783 13.0099 16.5111C12.2259 16.5467 11.9903 16.5545 10.0052 16.5545C8.01963 16.5545 7.78409 16.5467 7.00049 16.5111C6.27549 16.4775 5.88213 16.3568 5.61963 16.2549C5.27276 16.1201 5.02471 15.9592 4.76456 15.699C4.5044 15.4389 4.34307 15.192 4.20792 14.8451C4.10596 14.5834 3.98487 14.1904 3.95167 13.4658C3.91612 12.6826 3.90909 12.4471 3.90909 10.4631C3.90909 8.47871 3.91612 8.24473 3.95167 7.46152C3.98487 6.73691 4.10596 6.34395 4.20792 6.08184C4.34268 5.73496 4.50401 5.4873 4.76456 5.22715C5.02471 4.96699 5.27276 4.80605 5.61963 4.6709C5.88174 4.56855 6.27549 4.44785 7.00049 4.41465C7.68643 4.38379 7.95245 4.37441 9.33838 4.37285L9.33799 4.3752ZM13.9743 5.60918C13.4817 5.60918 13.0821 6.00801 13.0821 6.50059C13.0821 6.99277 13.4817 7.39238 13.9743 7.39238C14.4669 7.39238 14.8665 6.99316 14.8665 6.50059C14.8665 6.00801 14.4669 5.60879 13.9743 5.60918ZM10.0048 6.65098C7.89581 6.65098 6.18604 8.35957 6.18604 10.467C6.18604 12.5744 7.89581 14.2822 10.0048 14.2822C12.1138 14.2822 13.8228 12.5744 13.8228 10.467C13.8228 8.35957 12.1138 6.65098 10.0048 6.65098ZM10.0048 7.99004C11.3735 7.99004 12.4837 9.09902 12.4837 10.467C12.4837 11.835 11.3739 12.9439 10.0048 12.9439C8.63565 12.9439 7.52588 11.835 7.52588 10.467C7.52627 9.09863 8.63604 7.99004 10.0048 7.99004Z"
                                          fill="white"
                                        ></path>
                                      </g>
                                      <defs>
                                        <radialgradient
                                          id="paint0_radial_1291_20392"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(19.3544 9.84215) rotate(164.251) scale(12.7789 9.20658)"
                                        >
                                          <stop stop-color="#FF005F"></stop>
                                          <stop
                                            offset="1"
                                            stop-color="#FC01D8"
                                          ></stop>
                                        </radialgradient>
                                        <radialgradient
                                          id="paint1_radial_1291_20392"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(5.31239 22.0082) rotate(-90) scale(15.9644 16.9379)"
                                        >
                                          <stop stop-color="#FFCC00"></stop>
                                          <stop
                                            offset="0.1242"
                                            stop-color="#FFCC00"
                                          ></stop>
                                          <stop
                                            offset="0.5672"
                                            stop-color="#FE4A05"
                                          ></stop>
                                          <stop
                                            offset="0.6942"
                                            stop-color="#FF0F3F"
                                          ></stop>
                                          <stop
                                            offset="1"
                                            stop-color="#FE0657"
                                            stop-opacity="0"
                                          ></stop>
                                        </radialgradient>
                                        <radialgradient
                                          id="paint2_radial_1291_20392"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(10.5052 20.1857) rotate(-59.8697) scale(6.60141 8.59433)"
                                        >
                                          <stop stop-color="#FFCC00"></stop>
                                          <stop
                                            offset="1"
                                            stop-color="#FFCC00"
                                            stop-opacity="0"
                                          ></stop>
                                        </radialgradient>
                                        <radialgradient
                                          id="paint3_radial_1291_20392"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(2.71364 1.28282) rotate(164.274) scale(12.6371 4.30548)"
                                        >
                                          <stop stop-color="#780CFF"></stop>
                                          <stop
                                            offset="1"
                                            stop-color="#820BFF"
                                            stop-opacity="0"
                                          ></stop>
                                        </radialgradient>
                                        <clippath id="clip0_1291_20392">
                                          <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0 0.467773)"
                                          ></rect>
                                        </clippath>
                                      </defs></svg></a
                                  ><a
                                    href="https://linkedin.com"
                                    data-id="react-email-link"
                                    target="_blank"
                                    style="
                                      color: #067df7;
                                      text-decoration: none;
                                      background-color: rgb(255, 255, 255);
                                      width: 2.25rem;
                                      height: 2.25rem;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                      border-radius: 9999px;
                                    "
                                    ><svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="21"
                                      viewBox="0 0 20 21"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_1291_20400)">
                                        <path
                                          d="M18.5187 0.46875H1.47625C0.6625 0.46875 0 1.11438 0 1.90938V19.0244C0 19.8213 0.6625 20.4681 1.47625 20.4681H18.52C19.3356 20.4681 20 19.8213 20 19.0244V1.90938C20 1.11438 19.3356 0.46875 18.5187 0.46875Z"
                                          fill="#0177B5"
                                        ></path>
                                        <path
                                          d="M2.96563 7.96582H5.9375V17.5096H2.96563V7.96582ZM4.44937 3.21582C5.3975 3.21582 6.16813 3.98645 6.16813 4.93457C6.16813 5.8827 5.3975 6.6552 4.45 6.6552C3.99391 6.65421 3.55677 6.47263 3.23421 6.15018C2.91164 5.82773 2.72991 5.39066 2.72875 4.93457C2.72875 4.7087 2.77327 4.48505 2.85976 4.2764C2.94625 4.06775 3.07302 3.87819 3.23282 3.71857C3.39262 3.55894 3.58232 3.43238 3.79106 3.34612C3.99981 3.25985 4.22351 3.21557 4.44937 3.21582ZM7.79312 7.96582H10.6381V9.2702H10.6775C11.0737 8.5202 12.0412 7.72895 13.49 7.72895C16.4937 7.72895 17.0481 9.70582 17.0481 12.2752V17.5102H14.0837V12.8677C14.0837 11.7614 14.0637 10.3364 12.5425 10.3364C10.9987 10.3364 10.7612 11.5427 10.7612 12.7864V17.5077H7.7975V7.96395L7.79312 7.96582Z"
                                          fill="white"
                                        ></path>
                                      </g>
                                      <defs>
                                        <clippath id="clip0_1291_20400">
                                          <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0 0.467773)"
                                          ></rect>
                                        </clippath>
                                      </defs></svg></a
                                  ><a
                                    href="https://youtube.com"
                                    data-id="react-email-link"
                                    target="_blank"
                                    style="
                                      color: #067df7;
                                      text-decoration: none;
                                      background-color: rgb(255, 255, 255);
                                      width: 2.25rem;
                                      height: 2.25rem;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                      border-radius: 9999px;
                                    "
                                    ><svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="21"
                                      viewBox="0 0 20 21"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_1291_20404)">
                                        <path
                                          d="M17 0.467773H3C1.34315 0.467773 0 1.81092 0 3.46777V17.4678C0 19.1246 1.34315 20.4678 3 20.4678H17C18.6569 20.4678 20 19.1246 20 17.4678V3.46777C20 1.81092 18.6569 0.467773 17 0.467773Z"
                                          fill="#ED1D24"
                                        ></path>
                                        <path
                                          d="M16.6789 7.06953C16.5227 6.48359 16.0148 6.01484 15.4289 5.85859C14.1008 5.50703 6.09297 5.46797 4.56953 5.85859C3.98359 6.01484 3.47578 6.48359 3.31953 7.06953C2.96797 8.5539 2.9289 12.343 3.31953 13.8664C3.47578 14.4523 3.98359 14.9211 4.56953 15.0773C5.97578 15.468 13.9836 15.468 15.4289 15.0773C16.0148 14.9211 16.5227 14.4523 16.6789 13.8664C17.0305 12.4602 17.0305 8.51484 16.6789 7.06953Z"
                                          fill="white"
                                        ></path>
                                        <path
                                          d="M8.59375 8.39746V12.5381L12.2266 10.4678"
                                          fill="#ED1D24"
                                        ></path>
                                      </g>
                                      <defs>
                                        <clippath id="clip0_1291_20404">
                                          <rect
                                            width="20"
                                            height="20"
                                            fill="white"
                                            transform="translate(0 0.467773)"
                                          ></rect>
                                        </clippath>
                                      </defs></svg
                                  ></a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p
                          data-id="react-email-text"
                          style="
                            font-size: 0.75rem;
                            line-height: 1rem;
                            margin: 16px 0;
                            text-align: center;
                            color: rgb(255, 255, 255);
                          "
                        >
                          123 Davids Street, Floor 12San Francisco, <br />
                          CA, 94102
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`;

  const subject = "Slyft Password Reset";

  return {
    html,
    subject,
  };
};

export default forgotPasswordEmailTemplate;
