from django.conf.urls import url

import programs.views as apiVw

urlpatterns = [
    url(r'^programs/export_results/', apiVw.export_results),
    url(r'^programs/(?P<pk>\d+)', apiVw.ProgramDetail.as_view()),
    url(r'^programs/', apiVw.ProgramListView.as_view()),
    url(r'^versions/(?P<pk>\d+)', apiVw.VersionDetail.as_view()),
    url(r'^versions/', apiVw.VersionListView.as_view())
]
