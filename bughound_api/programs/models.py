from django.db import models


class Program(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        ordering = ['-id']
        db_table = 'programs'


class Version(models.Model):
    name = models.CharField(max_length=255)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='versions')

    class Meta:
        ordering = ['-id']
        db_table = 'program_versions'
        unique_together = ('name', 'program',)
