from io import BytesIO
import json
import base64
from datetime import datetime
from django.http import HttpResponse
from django.conf import settings
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from PIL import Image as PILImage
import os

class ModelReportGenerator:
    def __init__(self, trained_model):
        self.model = trained_model
        self.buffer = BytesIO()
        self.doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        self.styles = getSampleStyleSheet()
        self.story = []
        
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#2c3e50')
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.HexColor('#34495e')
        )
        
        self.subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=10,
            spaceBefore=15,
            textColor=colors.HexColor('#7f8c8d')
        )

    def generate_report(self):
        self._add_title()
        self._add_model_info()
        self._add_model_stats()
        self._add_model_graphs()
        self._add_footer()
        
        self.doc.build(self.story)
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf

    def _add_title(self):
        title = f"Machine Learning Model Report"
        self.story.append(Paragraph(title, self.title_style))
        
        subtitle = f"Model: {self.model.model_name}"
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=self.styles['Normal'],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=20,
            textColor=colors.HexColor('#7f8c8d')
        )
        self.story.append(Paragraph(subtitle, subtitle_style))
        
        date_text = f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        date_style = ParagraphStyle(
            'DateStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER,
            spaceAfter=30,
            textColor=colors.HexColor('#95a5a6')
        )
        self.story.append(Paragraph(date_text, date_style))

    def _add_model_info(self):
        self.story.append(Paragraph("Model Information", self.heading_style))
        
        model_data = [
            ['Model Type', self.model.get_model_type_display()],
            ['Target Column', self.model.target_column],
            ['Created Date', self.model.created_at.strftime('%B %d, %Y')],
            ['Public Model', 'Yes' if self.model.is_public else 'No'],
            ['Likes', str(self.model.likes)],
        ]
        
        if self.model.polynomial_degree:
            model_data.append(['Polynomial Degree', str(self.model.polynomial_degree)])
        
        if self.model.features:
            try:
                features = json.loads(self.model.features)
                if isinstance(features, list):
                    features_text = ', '.join(features[:5])
                    if len(features) > 5:
                        features_text += f' ... (+{len(features)-5} more)'
                else:
                    features_text = str(features)
            except:
                features_text = self.model.features[:100] + '...' if len(self.model.features) > 100 else self.model.features
            
            model_data.append(['Features', features_text])
        
        table = Table(model_data, colWidths=[2*inch, 4*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bdc3c7')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 20))

    def _add_model_stats(self):
        if not hasattr(self.model, 'stats') or not self.model.stats:
            return
        
        stats = self.model.stats
        self.story.append(Paragraph("Model Performance Metrics", self.heading_style))
        
        stats_data = []
        
        # Regression metrics
        if any([stats.r2_score, stats.mse, stats.mae]):
            self.story.append(Paragraph("Regression Metrics", self.subheading_style))
            
            if stats.r2_score is not None:
                stats_data.append(['R² Score', f"{stats.r2_score:.4f}"])
            if stats.mse is not None:
                stats_data.append(['Mean Squared Error (MSE)', f"{stats.mse:.4f}"])
            if stats.mae is not None:
                stats_data.append(['Mean Absolute Error (MAE)', f"{stats.mae:.4f}"])
        
        # Classification metrics
        if any([stats.accuracy, stats.precision, stats.recall, stats.f1_score]):
            if stats_data:
                self.story.append(Spacer(1, 10))
            
            self.story.append(Paragraph("Classification Metrics", self.subheading_style))
            
            if stats.accuracy is not None:
                stats_data.append(['Accuracy', f"{stats.accuracy:.4f}"])
            if stats.precision is not None:
                stats_data.append(['Precision', f"{stats.precision:.4f}"])
            if stats.recall is not None:
                stats_data.append(['Recall', f"{stats.recall:.4f}"])
            if stats.f1_score is not None:
                stats_data.append(['F1 Score', f"{stats.f1_score:.4f}"])
        
        if stats_data:
            stats_table = Table(stats_data, colWidths=[3*inch, 2*inch])
            stats_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8f5e8')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bdc3c7')),
            ]))
            
            self.story.append(stats_table)
            self.story.append(Spacer(1, 20))

    def _add_model_graphs(self):
        graphs = self.model.graphs.all()
        if not graphs:
            return
        
        self.story.append(Paragraph("Model Visualizations", self.heading_style))
        
        for graph in graphs:
            if graph.title:
                self.story.append(Paragraph(graph.title, self.subheading_style))

            if graph.description:
                desc_style = ParagraphStyle(
                    'GraphDesc',
                    parent=self.styles['Normal'],
                    fontSize=11,
                    spaceAfter=10,
                    alignment=TA_JUSTIFY
                )
                self.story.append(Paragraph(graph.description, desc_style))
            
            # Add graph image if available
            if graph.graph_image and os.path.exists(graph.graph_image.path):
                try:
                    # Resize image to fit page
                    img = PILImage.open(graph.graph_image.path)
                    img_width, img_height = img.size
                    
                    max_width = 6 * inch
                    max_height = 4 * inch
                    
                    scale = min(max_width / img_width, max_height / img_height)
                    new_width = img_width * scale
                    new_height = img_height * scale
                    
                    graph_img = Image(graph.graph_image.path, width=new_width, height=new_height)
                    self.story.append(graph_img)
                    self.story.append(Spacer(1, 15))
                    
                except Exception as e:
                    error_text = f"[Graph image could not be loaded: {graph.title}]"
                    error_style = ParagraphStyle(
                        'ErrorStyle',
                        parent=self.styles['Normal'],
                        fontSize=10,
                        textColor=colors.red,
                        alignment=TA_CENTER
                    )
                    self.story.append(Paragraph(error_text, error_style))
                    self.story.append(Spacer(1, 10))

    def _add_footer(self):
        self.story.append(Spacer(1, 30))
        
        footer_text = """
        This report was automatically generated by the Machine Learning Model Analysis System.
        For more information about this model or to access the interactive dashboard, 
        please visit the website.
        """
        
        footer_style = ParagraphStyle(
            'Footer',
            parent=self.styles['Normal'],
            fontSize=9,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#7f8c8d'),
            borderWidth=1,
            borderColor=colors.HexColor('#bdc3c7'),
            borderPadding=10
        )
        
        self.story.append(Paragraph(footer_text, footer_style))