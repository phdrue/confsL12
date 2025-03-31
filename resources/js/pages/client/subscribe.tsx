import ClientLayout from '@/layouts/client-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import { useEffect, useRef } from 'react';
import { useScript } from "@uidotdev/usehooks";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Стартовая страница',
        href: route('home'),
    },
    {
        title: 'Рассылка',
        href: route('subscribe'),
    },
];

export default function subscribe({ }) {
    return (
        <ClientLayout breadcrumbs={breadcrumbs}>
            <Head title="Рассылка" />
            <div className="mx-auto max-w-screen-xl pt-16 mb-24 w-full">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold">Рассылка</h1>
                </div>
                <div className="">
                    <div
                        id="static-form-container"
                        data-url="https://cp.unisender.com/en/v5/subscribe-form/view/6obaxtb3zkkrymiq4u1kceuhit96aeq1jer1ruka"
                        data-settings="6ic3p61xefndnuo3rdecjik7x77g9xmzepbu771fwj5ynek13e8py"
                    >
                        <form
                            method="POST"
                            action="https://cp.unisender.com/ru/subscribe?hash=6tkbaa8ojqdfkpo3rdecjik7x796pjr3af8ih3g69xatgiupeguyo"
                            name="subscribtion_form"
                            us_mode="embed"
                        >
                            <div className="container responsive">
                                <table
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align="center"
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        float: "left"
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            <td>
                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                <table
                                                    cellPadding={0}
                                                    cellSpacing={0}
                                                    align="center"
                                                    style={{

                                                        borderRadius: 0,
                                                        maxWidth: 900,
                                                        width: "100%",
                                                        border: "none",
                                                        margin: "0px auto",
                                                        borderSpacing: 0,
                                                        borderCollapse: "collapse"
                                                    }}
                                                >
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                width="100%"
                                                                style={{
                                                                    verticalAlign: "top",
                                                                    maxWidth: 450,
                                                                    fontSize: 0,
                                                                    padding: 25
                                                                }}
                                                            >
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium"
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>

                                                                            <td
                                                                                style={{
                                                                                    width: "100%",
                                                                                    backgroundImage: "none",
                                                                                    border: "none",
                                                                                    height: "100%"
                                                                                }}
                                                                                valign="top"
                                                                            >

                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        height: 0,
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse"
                                                                                    }}
                                                                                >

                                                                                    <tbody>
                                                                                        <tr>

                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    padding: "5px 10px 5px 20px",
                                                                                                    verticalAlign: "top",
                                                                                                    fontSize: 12,
                                                                                                    fontFamily:
                                                                                                        "Arial, Helvetica, sans-serif",
                                                                                                    lineHeight: "14.4px",
                                                                                                    color: "rgb(51, 51, 51)"
                                                                                                }}
                                                                                            >

                                                                                                <div
                                                                                                    style={{
                                                                                                        overflowWrap: "break-word",
                                                                                                        position: "relative"
                                                                                                    }}
                                                                                                    tabIndex={0}
                                                                                                    spellCheck="false"
                                                                                                    role="textbox"
                                                                                                    aria-label="false"
                                                                                                    aria-describedby="cke_45"
                                                                                                >
                                                                                                    <div style={{ textAlign: "center" }}>
                                                                                                        <strong>
                                                                                                            Форма подписки на рассылку
                                                                                                            "Медицинская наука: конференции,
                                                                                                            гранты, форумы, конкурсы"
                                                                                                        </strong>
                                                                                                        <br />
                                                                                                        <br />
                                                                                                        Здравствуйте, уважаемый коллега!
                                                                                                        <br />
                                                                                                        <br />
                                                                                                        Мы благодарим Вас за принятое решение
                                                                                                        подписаться на рассылку научных
                                                                                                        новостей Курского государственного
                                                                                                        медицинского университета и надеемся
                                                                                                        на участие в наших будущих проектах!
                                                                                                        <br />
                                                                                                        <br />
                                                                                                        Отписаться от рассылки можно в любое
                                                                                                        время, пройдя по ссылке в любом из
                                                                                                        писем.
                                                                                                        <br />
                                                                                                        <br />
                                                                                                    </div>
                                                                                                    <div style={{ textAlign: "center" }}>
                                                                                                        Нажимая кнопку «Отправить», Вы
                                                                                                        соглашаетесь с
                                                                                                        <a
                                                                                                            data-cke-saved-href="http://conferencinnova.ru/confs/persdata.html"
                                                                                                            target="_blank"
                                                                                                            href="http://conferencinnova.ru/confs/persdata.html"
                                                                                                        >
                                                                                                            Правилами обработки персональных
                                                                                                            данных &gt;&gt;&gt;
                                                                                                            <br />

                                                                                                        </a>
                                                                                                        <br />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium",
                                                                        // minHeight: 50
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>
                                                                            <td
                                                                                style={{
                                                                                    width: "100%",
                                                                                    backgroundImage: "none",
                                                                                    height: "100%",
                                                                                    verticalAlign: "middle",
                                                                                    minHeight: "auto",
                                                                                    fontSize: "medium"
                                                                                }}
                                                                                valign="top"
                                                                            >
                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        // height: 50,
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse",
                                                                                        // minHeight: 50
                                                                                    }}
                                                                                >
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    verticalAlign: "middle",
                                                                                                    // height: 50,
                                                                                                    // minHeight: 50
                                                                                                }}
                                                                                            >
                                                                                                <table
                                                                                                    border={0}
                                                                                                    cellSpacing={0}
                                                                                                    cellPadding={0}
                                                                                                    style={{
                                                                                                        width: "100%",
                                                                                                        tableLayout: "fixed",
                                                                                                        borderSpacing: 0,
                                                                                                        borderCollapse: "collapse",
                                                                                                        fontSize: 0
                                                                                                    }}
                                                                                                >
                                                                                                    <tbody>

                                                                                                        <tr>

                                                                                                            <td
                                                                                                                style={{
                                                                                                                    width: "100%",
                                                                                                                    backgroundColor:
                                                                                                                        "rgb(204, 204, 204)",
                                                                                                                    height: 1,
                                                                                                                    minHeight: 1,
                                                                                                                    maxHeight: 1,
                                                                                                                    lineHeight: 1
                                                                                                                }}
                                                                                                            >
                                                                                                                &nbsp;
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium"
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>

                                                                            <td
                                                                                style={{ width: "100%", padding: 8  }}
                                                                                valign="top"
                                                                            >

                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        height: "100%",
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse",
                                                                                        // minHeight: 50
                                                                                    }}
                                                                                >

                                                                                    <tbody>
                                                                                        <tr>

                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    fontFamily:
                                                                                                        "Arial, Helvetica, sans-serif",
                                                                                                    fontSize: 12,
                                                                                                    color: "rgb(34, 34, 34)"
                                                                                                }}
                                                                                            >

                                                                                                <div
                                                                                                    style={{
                                                                                                        display: "inline-block",
                                                                                                        width: "100%",
                                                                                                        fontSize: 0
                                                                                                    }}
                                                                                                >

                                                                                                    <label
                                                                                                        style={{
                                                                                                            fontSize: 12,
                                                                                                            padding: "0px 0px 5px",
                                                                                                            verticalAlign: "middle",
                                                                                                            boxSizing: "border-box",
                                                                                                            width: "32%",
                                                                                                            display: "inline-block",
                                                                                                            fontFamily:
                                                                                                                "Arial, Helvetica, sans-serif",
                                                                                                            color: "rgb(34, 34, 34)"
                                                                                                        }}
                                                                                                    >

                                                                                                        <span>E-mail</span>
                                                                                                        <b
                                                                                                            style={{
                                                                                                                fontSize: 14,
                                                                                                                fontFamily: "Georgia",
                                                                                                                lineHeight: 10
                                                                                                            }}
                                                                                                        >

                                                                                                            *
                                                                                                        </b>
                                                                                                    </label>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            display: "inline-block",
                                                                                                            width: "66%"
                                                                                                        }}
                                                                                                    >

                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="email"
                                                                                                            _validator="email"
                                                                                                            _required={1}
                                                                                                            style={{
                                                                                                                borderRadius: 3,
                                                                                                                font: "13px / 1 Arial, Helvetica",
                                                                                                                padding: "0px 8px",
                                                                                                                width: "100%",
                                                                                                                boxSizing: "border-box",
                                                                                                                border:
                                                                                                                    "1px solid rgb(193, 201, 203)",
                                                                                                                backgroundColor:
                                                                                                                    "rgb(255, 255, 255)",
                                                                                                                backgroundImage: "none",
                                                                                                                height: 30
                                                                                                            }}
                                                                                                            _label="E-mail"
                                                                                                            placeholder=""
                                                                                                        />
                                                                                                        <div
                                                                                                            className="error-block"
                                                                                                            style={{
                                                                                                                display: "none",
                                                                                                                color: "#ff592d",
                                                                                                                font: "11px/18px Arial"
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium"
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>

                                                                            <td
                                                                                style={{ width: "100%", padding: 8 }}
                                                                                valign="top"
                                                                            >

                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        height: "100%",
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse",
                                                                                        // minHeight: 50
                                                                                    }}
                                                                                >

                                                                                    <tbody>
                                                                                        <tr>

                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    fontFamily:
                                                                                                        "Arial, Helvetica, sans-serif",
                                                                                                    fontSize: 12,
                                                                                                    color: "rgb(34, 34, 34)"
                                                                                                }}
                                                                                            >

                                                                                                <div
                                                                                                    style={{
                                                                                                        display: "inline-block",
                                                                                                        width: "100%",
                                                                                                        fontSize: 0
                                                                                                    }}
                                                                                                >

                                                                                                    <label
                                                                                                        style={{
                                                                                                            fontSize: 12,
                                                                                                            padding: "0px 0px 5px",
                                                                                                            verticalAlign: "middle",
                                                                                                            boxSizing: "border-box",
                                                                                                            width: "32%",
                                                                                                            display: "inline-block",
                                                                                                            fontFamily:
                                                                                                                "Arial, Helvetica, sans-serif",
                                                                                                            color: "rgb(34, 34, 34)"
                                                                                                        }}
                                                                                                    >
                                                                                                        <span>Телефон</span>
                                                                                                        <b
                                                                                                            style={{
                                                                                                                fontSize: 14,
                                                                                                                fontFamily: "Georgia",
                                                                                                                lineHeight: 10
                                                                                                            }}
                                                                                                        >

                                                                                                            *
                                                                                                        </b>
                                                                                                    </label>
                                                                                                    <div
                                                                                                        style={{
                                                                                                            display: "inline-block",
                                                                                                            width: "66%"
                                                                                                        }}
                                                                                                    >

                                                                                                        <input
                                                                                                            type="text"
                                                                                                            style={{
                                                                                                                borderRadius: 3,
                                                                                                                font: "13px / 1 Arial, Helvetica",
                                                                                                                padding: "0px 8px",
                                                                                                                width: "100%",
                                                                                                                boxSizing: "border-box",
                                                                                                                border:
                                                                                                                    "1px solid rgb(193, 201, 203)",
                                                                                                                backgroundColor:
                                                                                                                    "rgb(255, 255, 255)",
                                                                                                                backgroundImage: "none",
                                                                                                                height: 30
                                                                                                            }}
                                                                                                            name="f_6249766"
                                                                                                            _validator="string"
                                                                                                            _label="Телефон"
                                                                                                            _required={1}
                                                                                                            placeholder=""
                                                                                                        />
                                                                                                        <div
                                                                                                            className="error-block"
                                                                                                            style={{
                                                                                                                display: "none",
                                                                                                                color: "#ff592d",
                                                                                                                font: "11px/18px Arial"
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium"
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>

                                                                            <td
                                                                                style={{ width: "100%", padding: 8, height: 0 }}
                                                                                valign="top"
                                                                            >

                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        height: "100%",
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse",
                                                                                        minHeight: 0
                                                                                    }}
                                                                                >

                                                                                    <tbody>
                                                                                        <tr>

                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    verticalAlign: "top",
                                                                                                    fontFamily:
                                                                                                        "Arial, Helvetica, sans-serif",
                                                                                                    fontSize: 12,
                                                                                                    color: "rgb(34, 34, 34)"
                                                                                                }}
                                                                                            >

                                                                                                <div
                                                                                                    style={{
                                                                                                        display: "inline-block",
                                                                                                        width: "100%"
                                                                                                    }}
                                                                                                >

                                                                                                    <label
                                                                                                        style={{
                                                                                                            fontFamily:
                                                                                                                "Arial, Helvetica, sans-serif",
                                                                                                            fontSize: 12,
                                                                                                            color: "rgb(34, 34, 34)"
                                                                                                        }}
                                                                                                    >
                                                                                                        <span>Рассылки</span>
                                                                                                        <b
                                                                                                            style={{
                                                                                                                fontSize: 14,
                                                                                                                fontFamily: "Georgia",
                                                                                                                lineHeight: 10
                                                                                                            }}
                                                                                                        >

                                                                                                            *
                                                                                                        </b>
                                                                                                    </label>
                                                                                                    <ul
                                                                                                        style={{
                                                                                                            listStyle: "none",
                                                                                                            padding: 0
                                                                                                        }}
                                                                                                    >
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={12681625}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Акушерство и гинекология
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547859}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Хирургия</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547861}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Гуманитарные науки</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547862}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Фармация</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547863}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Биотехнологии</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547864}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Биофизика, математика, статистика
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547865}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Терапия</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547866}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Морфология: нормальная и
                                                                                                                патологическая
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547867}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Биология, генетика, биохимия
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547868}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Физиология: нормальная и
                                                                                                                патологическая
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547869}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Инфекционные болезни /
                                                                                                                эпидемиология / гигиена /
                                                                                                                микробиология
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547870}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Диагностика</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547871}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Анестезиология и реаниматология /
                                                                                                                медицина катастроф
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547872}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Психиатрия / наркология
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547873}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Неврология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547874}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Онкология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547875}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Организация здравоохранения и
                                                                                                                фармдела
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547876}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Оториноларингология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547877}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Офтальмология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547878}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Педиатрия</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547879}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Реабилитация / спортивная и
                                                                                                                авиакосмическая медицина
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547880}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Стоматология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547881}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Судебная медицина</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547882}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Травматология и ортопедия
                                                                                                            </label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547884}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>Урология</label>
                                                                                                        </li>
                                                                                                        <li style={{ padding: 2 }}>
                                                                                                            <input
                                                                                                                _label="Рассылки"
                                                                                                                _required={1}
                                                                                                                type="checkbox"
                                                                                                                name="list_ids[]"
                                                                                                                defaultValue={20547885}
                                                                                                                style={{
                                                                                                                    display: "inline-block",
                                                                                                                    verticalAlign: "top",
                                                                                                                    margin: "1px 4px 0px 0px"
                                                                                                                }}
                                                                                                            />
                                                                                                            <label>
                                                                                                                Фармакология / клиническая
                                                                                                                фармакология
                                                                                                            </label>
                                                                                                        </li>
                                                                                                    </ul>
                                                                                                    <div
                                                                                                        className="error-block"
                                                                                                        style={{
                                                                                                            display: "none",
                                                                                                            color: "#ff592d",
                                                                                                            font: "11px/18px Arial"
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                                {/*[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0" width="400" align="center"><tr><td><![endif]*/}
                                                                <table
                                                                    width="100%"
                                                                    border={0}
                                                                    cellSpacing={0}
                                                                    cellPadding={0}
                                                                    style={{
                                                                        width: "100%",
                                                                        tableLayout: "fixed",
                                                                        height: "auto",
                                                                        borderCollapse: "collapse",
                                                                        borderSpacing: 0,
                                                                        display: "inline-table",
                                                                        verticalAlign: "top",
                                                                        fontSize: "medium"
                                                                    }}
                                                                >

                                                                    <tbody>
                                                                        <tr>

                                                                            <td
                                                                                style={{
                                                                                    width: "100%",
                                                                                    backgroundImage: "none",
                                                                                    minHeight: 0,
                                                                                    height: 0
                                                                                }}
                                                                                valign="top"
                                                                            >

                                                                                <table
                                                                                    border={0}
                                                                                    cellSpacing={0}
                                                                                    cellPadding={0}
                                                                                    style={{
                                                                                        height: "100%",
                                                                                        width: "100%",
                                                                                        tableLayout: "fixed",
                                                                                        borderSpacing: 0,
                                                                                        borderCollapse: "collapse",
                                                                                        minHeight: 0
                                                                                    }}
                                                                                >

                                                                                    <tbody>
                                                                                        <tr>

                                                                                            <td
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    textAlign: "center",
                                                                                                    fontFamily:
                                                                                                        "Arial, Helvetica, sans-serif",
                                                                                                    fontSize: 12,
                                                                                                    color: "rgb(34, 34, 34)"
                                                                                                }}
                                                                                            >

                                                                                                <table
                                                                                                    border={0}
                                                                                                    cellPadding={0}
                                                                                                    cellSpacing={0}
                                                                                                    width="100%"
                                                                                                    style={{
                                                                                                        display: "inline-table",
                                                                                                        width: "auto",
                                                                                                        borderSpacing: 0,
                                                                                                        borderCollapse: "collapse"
                                                                                                    }}
                                                                                                >

                                                                                                    <tbody>
                                                                                                        <tr>

                                                                                                            <td
                                                                                                                align="center"
                                                                                                                valign="middle"
                                                                                                                style={{
                                                                                                                    border: "none",
                                                                                                                    borderRadius: 30,
                                                                                                                    padding: "15px 20px 17px",
                                                                                                                    backgroundColor:
                                                                                                                        "rgb(0, 95, 191)",
                                                                                                                    height: "18.7969px",
                                                                                                                    minHeight: "18.7969px"
                                                                                                                }}
                                                                                                            >

                                                                                                                <button
                                                                                                                    href="javascript:"
                                                                                                                    target="_blank"
                                                                                                                    style={{
                                                                                                                        width: "100%",
                                                                                                                        display: "inline-block",
                                                                                                                        textDecoration: "none",
                                                                                                                        wordBreak: "break-all",
                                                                                                                        fontSize: 14,
                                                                                                                        fontFamily:
                                                                                                                            "Arial, Helvetica, sans-serif",
                                                                                                                        lineHeight: "16.8px",
                                                                                                                        color: "rgb(255, 255, 255)",
                                                                                                                        backgroundColor:
                                                                                                                            "rgb(0, 95, 191)",
                                                                                                                        border: 0
                                                                                                                    }}
                                                                                                                >
                                                                                                                    Подписаться
                                                                                                                </button>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {/*[if (gte mso 9)|(IE)]></td></tr></table><![endif]*/}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <input type="hidden" name="charset" defaultValue="UTF-8" />
                            <input type="hidden" name="default_list_id" defaultValue={12681037} />
                            <input type="hidden" name="overwrite" defaultValue={2} />
                            <input type="hidden" name="is_v5" defaultValue={1} />
                        </form>
                    </div>

                </div>
            </div>
            <Footer />
        </ClientLayout >
    );
}
