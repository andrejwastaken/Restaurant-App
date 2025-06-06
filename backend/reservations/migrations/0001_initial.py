# Generated by Django 5.1.7 on 2025-05-07 18:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time', models.DateTimeField()),
                ('number_of_people', models.IntegerField()),
                ('status', models.CharField(choices=[('PENDING', 'pending'), ('CONFIRMED', 'confirmed'), ('BLOCKED', 'blocked')], default='PENDING', max_length=10)),
                ('comment', models.TextField(blank=True, null=True)),
                ('is_smoker', models.BooleanField(default=False)),
                ('client', models.ForeignKey(limit_choices_to={'is_client': True}, on_delete=django.db.models.deletion.CASCADE, to='clients.clientprofile')),
            ],
        ),
    ]
