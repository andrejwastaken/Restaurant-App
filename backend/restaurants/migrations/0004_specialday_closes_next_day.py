# Generated by Django 5.1.7 on 2025-06-27 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0003_operationhours_closes_next_day'),
    ]

    operations = [
        migrations.AddField(
            model_name='specialday',
            name='closes_next_day',
            field=models.BooleanField(default=False, help_text='Does this time close the next day?'),
        ),
    ]
