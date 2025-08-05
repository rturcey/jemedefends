from weasyprint import HTML

HTML(
    string="""
    <html>
        <body>
            <img src="/home/rturcey/perso/jemedefends/app/static/images/logo_jemedefends.svg" width="100">
        </body>
    </html>
    """,
    base_url="/chemin/absolu/vers/ton/projet"
).write_pdf("test.pdf")

