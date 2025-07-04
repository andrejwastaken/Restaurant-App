# Generated by Django 5.1.7 on 2025-06-23 23:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='specialday',
            name='setup',
            field=models.ForeignKey(help_text='The restaurant setup this Special Day belongs to.', on_delete=django.db.models.deletion.CASCADE, related_name='special_days', to='restaurants.restaurantsetup'),
        ),
        migrations.CreateModel(
            name='FavouriteRestaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='The date and time when the restaurant was favourited.')),
                ('restaurant', models.ForeignKey(help_text='The restaurant that was favourited.', on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='restaurants.restaurant')),
                ('user', models.ForeignKey(help_text='The user who favourited the restaurant.', on_delete=django.db.models.deletion.CASCADE, related_name='favourite_restaurants', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Favourite Restaurant',
                'verbose_name_plural': 'Favourite Restaurants',
                'ordering': ['-created_at'],
                'unique_together': {('user', 'restaurant')},
            },
        ),
    ]
