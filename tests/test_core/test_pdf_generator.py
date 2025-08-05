# tests/test_pdf_generator.py
from datetime import date

import pytest

from app.core.pdf_generator import PDFGenerator
from app.models.letters import DefectType, LetterRequest, PDFOptions


@pytest.fixture
def sample_letter_data():
    """Sample letter data for testing."""
    return LetterRequest(
        session_id="test-session-123",
        buyer_name="Jean Dupont",
        buyer_address="123 Rue de la Paix\n75001 Paris",
        buyer_email="jean.dupont@email.com",
        seller_name="Boutique Example",
        seller_address="456 Avenue du Commerce\n69000 Lyon",
        purchase_date=date(2024, 1, 15),
        product_name="Smartphone XYZ",
        order_reference="CMD-2024-001",
        amount=599.99,
        defect_type=DefectType.MALFUNCTION,
        defect_description="L'écran ne s'allume plus après 2 semaines d'utilisation normale.",
    )


@pytest.fixture
def pdf_generator():
    """PDF generator instance."""
    return PDFGenerator()


def test_pdf_generator_initialization(pdf_generator):
    """Test PDF generator initialization."""
    assert pdf_generator is not None
    assert pdf_generator.font_config is not None
    assert pdf_generator.base_css is not None


def test_generate_pdf_basic(pdf_generator, sample_letter_data):
    """Test basic PDF generation."""
    html_content = """
    <html>
    <body>
        <p>Test letter content</p>
        <p>Buyer: {{ buyer_name }}</p>
        <p>Product: {{ product_name }}</p>
    </body>
    </html>
    """

    options = PDFOptions()

    pdf_bytes = pdf_generator.generate_pdf(html_content, sample_letter_data, options)

    assert pdf_bytes is not None
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    # Check PDF signature
    assert pdf_bytes.startswith(b"%PDF-")


def test_generate_pdf_with_options(pdf_generator, sample_letter_data):
    """Test PDF generation with custom options."""
    html_content = "<html><body><p>Test content</p></body></html>"

    options = PDFOptions(
        format="Letter",
    )

    pdf_bytes = pdf_generator.generate_pdf(html_content, sample_letter_data, options)

    assert pdf_bytes is not None
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0


def test_process_assets_with_missing_logo(pdf_generator):
    """Test asset processing when logo is missing."""
    html_content = """
    <html>
    <body>
        <img src="logo_jemedefends.png" alt="Logo Je Me Défends">
        <p>Content</p>
    </body>
    </html>
    """

    processed_html = pdf_generator._process_assets(html_content)

    assert processed_html is not None
    # Should replace missing logo with placeholder
    assert (
        "logo_jemedefends.png" not in processed_html
        or "placeholder" in processed_html.lower()
    )


def test_get_custom_css(pdf_generator):
    """Test custom CSS generation."""
    options_a4 = PDFOptions(format="A4")
    css_a4 = pdf_generator._get_custom_css(options_a4)

    options_letter = PDFOptions(format="Letter")
    css_letter = pdf_generator._get_custom_css(options_letter)

    assert isinstance(css_a4, str)
    assert isinstance(css_letter, str)
    assert "Letter" not in css_a4
    assert "8.5in 11in" in css_letter
    assert "display: none" in css_a4  # QR code hidden
    assert "display: block" in css_letter  # QR code visible


def test_pdf_generation_error_handling(pdf_generator, sample_letter_data):
    """Test error handling in PDF generation."""
    # Invalid HTML content
    invalid_html = "<html><body><unclosed_tag></body></html>"
    options = PDFOptions()

    # Should handle gracefully or raise ProcessingError
    try:
        pdf_bytes = pdf_generator.generate_pdf(
            invalid_html, sample_letter_data, options
        )
        # If no exception, PDF should still be generated
        assert pdf_bytes is not None
    except Exception as e:
        # Should be a ProcessingError
        assert "PDF" in str(e) or "generation" in str(e).lower()
