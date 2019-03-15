
from django.conf.urls import url

import bugs.views as apiVw

urlpatterns = [
    url(r'^export_results/', apiVw.export_results),
    url(r'^bugs/(?P<pk>\d+)', apiVw.BugDetail.as_view()),
    url(r'^bugs/', apiVw.BugListView.as_view()),
    url(r'^areas/', apiVw.AreaListView.as_view())
]
