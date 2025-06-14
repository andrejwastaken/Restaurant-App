# Generated by Django 5.1.7 on 2025-06-08 21:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_of_guests', models.PositiveIntegerField(help_text="How many guests are attending (must be less than or equal to the table's capacity).")),
                ('status', models.CharField(choices=[('PENDING', 'pending'), ('CONFIRMED', 'confirmed'), ('BLOCKED', 'blocked')], default='PENDING', max_length=10)),
                ('comment', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
