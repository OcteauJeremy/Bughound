from django.contrib.auth.models import User
from django.db import models

REPORT_TYPE = (
    (0, 'Coding Error'),
    (1, 'Design Issue'),
    (2, 'Suggestion'),
    (3, 'Documentation'),
    (4, 'Hardware'),
    (5, 'Query')
)

SEVERITY = (
    (0, 'Minor'),
    (1, 'Serious'),
    (2, 'Fatal')
)

STATUS = (
    (0, 'Open'),
    (1, 'Closed'),
    (2, 'Resolved')
)

PRIORITY = (
    (0, 'Fix immediately'),
    (1, 'Fix as soon as possible'),
    (2, 'Fix before next milestone'),
    (3, 'Fix before release'),
    (4, 'Fix if possible'),
    (5, 'Optional'),
)

RESOLUTION = (
    (0, 'Pending'),
    (1, 'Fixed'),
    (2, 'Irreproducible'),
    (3, 'Deferred'),
    (4, 'As designed'),
    (5, 'Withdrawn by reporter'),
    (6, 'Need more info'),
    (7, 'Disagree with suggestion'),
    (8, 'Duplicate'),
)

AREA = (
    (0, 'Lexer'),
    (1, 'Parser'),
    (2, 'Compiler'),
    (3, 'Source code')
)


class Area(models.Model):
    name = models.CharField(max_length=255)
    program = models.ForeignKey('programs.program', related_name='areas', on_delete=models.CASCADE)

    class Meta:
        ordering = ['-id']
        db_table = 'areas'


class Bug(models.Model):
    program = models.ForeignKey('programs.program', on_delete=models.CASCADE)
    bug_version = models.ForeignKey('programs.version', on_delete=models.CASCADE, related_name='reported_bugs')
    report_type = models.IntegerField(
        choices=REPORT_TYPE,
        default=0,
    )
    severity = models.IntegerField(
        choices=SEVERITY,
        default=0
    )
    summary = models.TextField()
    reproducible = models.BooleanField(default=False)
    description = models.TextField()
    suggested_fix = models.TextField()
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_bugs')
    reported_date = models.DateField()

    functional_area = models.ForeignKey(Area, on_delete=models.CASCADE, null=True, default=None)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_bugs', null=True, default=None)
    comments = models.TextField(default='')
    status = models.IntegerField(
        choices=STATUS,
        default=0
    )
    priority = models.IntegerField(
        choices=PRIORITY,
        default=0
    )
    resolution = models.IntegerField(
        choices=RESOLUTION,
        default=0
    )
    resolution_version = models.ForeignKey('programs.version', on_delete=models.CASCADE, related_name='solved_bugs',
                                           null=True, default=None)
    solved_date = models.DateField(null=True, default=None)

    class Meta:
        ordering = ['-id']
        db_table = 'bugs'


class Attachment(models.Model):
    attachment = models.ImageField(upload_to='attachments/', blank=True)
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-id']
        db_table = 'attachments'
