# Generated by Django 2.1.5 on 2019-02-06 02:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attachment', models.ImageField(blank=True, upload_to='attachments/')),
            ],
        ),
        migrations.CreateModel(
            name='Bug',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_type', models.IntegerField(choices=[(0, 'Coding Error'), (1, 'Design Issue'), (2, 'Suggestion'), (3, 'Documentation'), (4, 'Hardware'), (5, 'Query')], default=0)),
                ('severity', models.IntegerField(choices=[(0, 'Minor'), (1, 'Serious'), (2, 'Fatal')], default=0)),
                ('summary', models.TextField()),
                ('reproducible', models.BooleanField(default=False)),
                ('description', models.TextField()),
                ('suggested_fix', models.TextField()),
                ('date', models.DateField()),
                ('functional_area', models.IntegerField(choices=[(0, 'Lexer'), (1, 'Parser'), (2, 'Compiler'), (3, 'Source code')], default=0)),
                ('comments', models.TextField()),
                ('status', models.IntegerField(choices=[(0, 'Open'), (1, 'Closed'), (2, 'Resolved')], default=0)),
                ('priority', models.IntegerField(choices=[(0, 'Fix immediately'), (1, 'Fix as soon as possible'), (2, 'Fix before next milestone'), (3, 'Fix before release'), (4, 'Fix if possible'), (5, 'Optional')], default=0)),
                ('resolution', models.IntegerField(choices=[(0, 'Pending'), (1, 'Fixed'), (2, 'Irreproducible'), (3, 'Deferred'), (4, 'As designed'), (5, 'Withdrawn by reporter'), (6, 'Need more info'), (7, 'Disagree with suggestion'), (8, 'Duplicate')], default=0)),
                ('assigned_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_bugs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Version',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='bugs.Program')),
            ],
        ),
        migrations.AddField(
            model_name='bug',
            name='program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugs.Program'),
        ),
        migrations.AddField(
            model_name='bug',
            name='report_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_bugs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='bug',
            name='resolution_version',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugs.Version'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='bug',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bugs.Bug'),
        ),
    ]